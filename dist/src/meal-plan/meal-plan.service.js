"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MealPlanService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const date_utils_1 = require("../date.utils");
let MealPlanService = class MealPlanService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByRange(userId, from, to) {
        if (!from || !to) {
            throw new common_1.BadRequestException('From and to dates are required');
        }
        const fromDate = this.parseDate(from);
        const toDate = this.parseDate(to);
        const rangeInDays = Math.round((toDate.getTime() - fromDate.getTime()) / 86_400_000);
        if (rangeInDays < 0) {
            throw new common_1.BadRequestException('To date must not be before from date');
        }
        if (rangeInDays > 92) {
            throw new common_1.BadRequestException('Date range must not exceed 93 days');
        }
        const plans = await this.prisma.mealPlan.findMany({
            where: {
                user_id: userId,
                plan_date: { gte: fromDate, lte: toDate },
            },
            orderBy: { plan_date: 'asc' },
            include: {
                meal_plan_items: {
                    orderBy: { sort_order: 'asc' },
                    include: { recipe: true },
                },
            },
        });
        return {
            from,
            to,
            plans: plans.map((plan) => ({
                id: plan.meal_plan_id,
                date: (0, date_utils_1.formatDateOnly)(plan.plan_date),
                totalCalories: plan.total_calories,
                totalCost: Number(plan.total_cost),
                items: plan.meal_plan_items.map((item) => ({
                    id: item.meal_plan_item_id,
                    mealType: item.meal_type,
                    servings: Number(item.servings),
                    calories: item.calories_snapshot,
                    cost: Number(item.cost_snapshot),
                    recipe: {
                        id: item.recipe.recipe_id,
                        name: item.recipe.name,
                        description: item.recipe.description,
                        mealType: item.recipe.meal_type,
                        calories: item.recipe.calories,
                        protein: Number(item.recipe.protein_g),
                        carbs: Number(item.recipe.carbs_g),
                        fat: Number(item.recipe.fat_g),
                        estimatedCost: Number(item.recipe.estimated_cost),
                        emoji: item.recipe.emoji,
                    },
                })),
            })),
        };
    }
    async findByDate(userId, requestedDate) {
        const planDate = this.parseDate(requestedDate);
        return this.prisma.mealPlan.findUnique({
            where: { user_id_plan_date: { user_id: userId, plan_date: planDate } },
            include: {
                meal_plan_items: {
                    orderBy: { sort_order: 'asc' },
                    include: { recipe: true },
                },
            },
        });
    }
    async upsert(userId, requestedDate, dto) {
        const planDate = this.parseDate(requestedDate);
        this.validateUniqueMealTypes(dto.items);
        return this.prisma.$transaction(async (transaction) => {
            const recipes = await transaction.recipe.findMany({
                where: {
                    recipe_id: { in: dto.items.map((item) => item.recipe_id) },
                    is_active: true,
                },
            });
            const recipesById = new Map(recipes.map((recipe) => [recipe.recipe_id, recipe]));
            for (const item of dto.items) {
                const recipe = recipesById.get(item.recipe_id);
                if (!recipe) {
                    throw new common_1.BadRequestException('Recipe not found or inactive');
                }
                if (recipe.meal_type !== item.meal_type) {
                    throw new common_1.BadRequestException('Recipe meal type does not match the plan item');
                }
            }
            const mealPlan = await transaction.mealPlan.upsert({
                where: { user_id_plan_date: { user_id: userId, plan_date: planDate } },
                create: { user_id: userId, plan_date: planDate },
                update: {},
            });
            await transaction.mealPlanItem.deleteMany({
                where: { meal_plan_id: mealPlan.meal_plan_id },
            });
            const items = dto.items.map((item, index) => {
                const recipe = recipesById.get(item.recipe_id);
                const servings = item.servings ?? 1;
                return {
                    meal_plan_id: mealPlan.meal_plan_id,
                    recipe_id: recipe.recipe_id,
                    meal_type: item.meal_type,
                    servings,
                    calories_snapshot: Math.round(recipe.calories * servings),
                    cost_snapshot: Number(recipe.estimated_cost) * servings,
                    sort_order: index,
                };
            });
            if (items.length > 0) {
                await transaction.mealPlanItem.createMany({ data: items });
            }
            const totalCalories = items.reduce((sum, item) => sum + item.calories_snapshot, 0);
            const totalCost = items.reduce((sum, item) => sum + item.cost_snapshot, 0);
            return transaction.mealPlan.update({
                where: { meal_plan_id: mealPlan.meal_plan_id },
                data: { total_calories: totalCalories, total_cost: totalCost },
                include: {
                    meal_plan_items: {
                        orderBy: { sort_order: 'asc' },
                        include: { recipe: true },
                    },
                },
            });
        });
    }
    async delete(userId, planId) {
        const plan = await this.prisma.mealPlan.findUnique({
            where: { meal_plan_id: planId },
        });
        if (!plan) {
            throw new common_1.NotFoundException('Meal plan not found');
        }
        if (plan.user_id !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own meal plan');
        }
        await this.prisma.mealPlan.delete({ where: { meal_plan_id: planId } });
        return { message: 'Meal plan deleted successfully' };
    }
    validateUniqueMealTypes(items) {
        const mealTypes = items.map((item) => item.meal_type);
        if (new Set(mealTypes).size !== mealTypes.length) {
            throw new common_1.BadRequestException('Each meal type can only appear once');
        }
    }
    parseDate(value) {
        const dateValue = value ?? (0, date_utils_1.formatBangkokDateKey)();
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
            throw new common_1.BadRequestException('Date must use YYYY-MM-DD format');
        }
        const date = (0, date_utils_1.parseDateOnly)(dateValue);
        if (!date) {
            throw new common_1.BadRequestException('Invalid date');
        }
        return date;
    }
};
exports.MealPlanService = MealPlanService;
exports.MealPlanService = MealPlanService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MealPlanService);
//# sourceMappingURL=meal-plan.service.js.map