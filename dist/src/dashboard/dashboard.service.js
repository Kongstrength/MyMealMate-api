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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboard(userId, requestedDate) {
        const planDate = this.parseDate(requestedDate);
        const user = await this.prisma.user.findUnique({
            where: { user_id: userId },
            select: {
                user_id: true,
                username: true,
                full_name: true,
                budget_daily: true,
                budget_weekly: true,
                budget_monthly: true,
                daily_target_calories: true,
                liked_foods: true,
                preferred_food_types: true,
                health_goals_list: true,
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        const mealPlan = await this.prisma.mealPlan.findUnique({
            where: {
                user_id_plan_date: {
                    user_id: userId,
                    plan_date: planDate,
                },
            },
            include: {
                meal_plan_items: {
                    orderBy: { sort_order: 'asc' },
                    include: {
                        recipe: true,
                    },
                },
            },
        });
        return {
            date: requestedDate ?? this.formatDate(planDate),
            user: {
                ...user,
                budget_daily: Number(user.budget_daily),
                budget_weekly: Number(user.budget_weekly),
                budget_monthly: Number(user.budget_monthly),
            },
            mealPlan: mealPlan
                ? {
                    id: mealPlan.meal_plan_id,
                    totalCalories: mealPlan.total_calories,
                    totalCost: Number(mealPlan.total_cost),
                    items: mealPlan.meal_plan_items.map((item) => ({
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
                }
                : null,
        };
    }
    parseDate(value) {
        const dateValue = value ?? this.formatDate(new Date());
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
            throw new common_1.BadRequestException('Date must use YYYY-MM-DD format');
        }
        const date = new Date(`${dateValue}T00:00:00.000+07:00`);
        if (Number.isNaN(date.getTime())) {
            throw new common_1.BadRequestException('Invalid date');
        }
        return date;
    }
    formatDate(date) {
        return new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Asia/Bangkok',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(date);
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map