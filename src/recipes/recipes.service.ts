import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecipesService {
  constructor(private readonly prisma: PrismaService) {}

  async findActive(mealType?: string) {
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
        estimatedPrice:
          ingredient.estimated_price === null
            ? null
            : Number(ingredient.estimated_price),
      })),
      steps: recipe.steps.map((step) => step.instruction),
    }));
  }
}
