import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(userId: string, requestedDate?: string) {
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
      throw new BadRequestException('User not found');
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

  private parseDate(value?: string) {
    const dateValue = value ?? this.formatDate(new Date());

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      throw new BadRequestException('Date must use YYYY-MM-DD format');
    }

    const date = new Date(`${dateValue}T00:00:00.000+07:00`);
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date');
    }

    return date;
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
