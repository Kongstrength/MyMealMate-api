import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MealPlanService } from '../meal-plan/meal-plan.service';
import { withProfileCompleteness } from '../users/profile-completeness';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mealPlanService: MealPlanService,
  ) {}

  async getDashboard(userId: string, requestedDate?: string) {
    const [user, mealPlan] = await Promise.all([
      this.prisma.user.findUnique({
        where: { user_id: userId },
        select: {
          user_id: true,
          username: true,
          email: true,
          full_name: true,
          phone: true,
          age: true,
          gender: true,
          height: true,
          weight: true,
          bmi: true,
          birthday: true,
          activity_level: true,
          budget_daily: true,
          budget_weekly: true,
          budget_monthly: true,
          calories_per_day: true,
          daily_target_calories: true,
          liked_foods: true,
          disliked_foods: true,
          food_allergies: true,
          preferred_food_types: true,
          health_goals_list: true,
        },
      }),
      this.mealPlanService.findByDate(userId, requestedDate),
    ]);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return {
      date: requestedDate ?? this.formatDate(new Date()),
      user: withProfileCompleteness({
        ...user,
        bmi: Number(user.bmi),
        budget_daily: Number(user.budget_daily),
        budget_weekly: Number(user.budget_weekly),
        budget_monthly: Number(user.budget_monthly),
      }),
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

  private formatDate(date: Date) {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  }
}
