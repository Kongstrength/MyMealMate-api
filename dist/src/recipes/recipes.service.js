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
exports.RecipesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RecipesService = class RecipesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findActive(mealType) {
        const recipes = await this.prisma.recipe.findMany({
            where: {
                is_active: true,
                ...(mealType ? { meal_type: mealType.toUpperCase() } : {}),
            },
            orderBy: [{ meal_type: 'asc' }, { name: 'asc' }],
            include: {
                ingredients: { orderBy: { sort_order: 'asc' } },
                steps: { orderBy: { sort_order: 'asc' } },
            },
        });
        return recipes.map((recipe) => ({
            id: recipe.recipe_id,
            name: recipe.name,
            description: recipe.description,
            mealType: recipe.meal_type,
            calories: recipe.calories,
            protein: Number(recipe.protein_g),
            carbs: Number(recipe.carbs_g),
            fat: Number(recipe.fat_g),
            estimatedCost: Number(recipe.estimated_cost),
            emoji: recipe.emoji,
            source: recipe.source,
            cookingTips: recipe.cooking_tips,
            ingredients: recipe.ingredients.map((ingredient) => ({
                name: ingredient.name,
                amount: ingredient.amount,
                estimatedPrice: ingredient.estimated_price === null
                    ? null
                    : Number(ingredient.estimated_price),
            })),
            steps: recipe.steps.map((step) => step.instruction),
        }));
    }
};
exports.RecipesService = RecipesService;
exports.RecipesService = RecipesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RecipesService);
//# sourceMappingURL=recipes.service.js.map