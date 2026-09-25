import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  formatBangkokDateKey,
  formatDateOnly,
  parseDateOnly,
} from '../date.utils';
import { MealPlanItemDto, UpsertMealPlanDto } from './dto/upsert-meal-plan.dto';

@Injectable()
export class MealPlanService {
  constructor(private readonly prisma: PrismaService) {}

  async findByRange(userId: string, from?: string, to?: string) {
    if (!from || !to) {
      throw new BadRequestException('From and to dates are required');
    }

    const fromDate = this.parseDate(from);
    const toDate = this.parseDate(to);
    const rangeInDays = Math.round(
      (toDate.getTime() - fromDate.getTime()) / 86_400_000,
    );

    if (rangeInDays < 0) {
      throw new BadRequestException('To date must not be before from date');
    }
    if (rangeInDays > 92) {
      throw new BadRequestException('Date range must not exceed 93 days');
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
        date: formatDateOnly(plan.plan_date),
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

  async findByDate(userId: string, requestedDate?: string) {
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

  async upsert(
    userId: string,
    requestedDate: string | undefined,
    dto: UpsertMealPlanDto,
  ) {
    const planDate = this.parseDate(requestedDate);
    this.validateUniqueMealTypes(dto.items);

    return this.prisma.$transaction(async (transaction) => {
      const recipes = await transaction.recipe.findMany({
        where: {
          recipe_id: { in: dto.items.map((item) => item.recipe_id) },
          is_active: true,
        },
      });
      const recipesById = new Map(
        recipes.map((recipe) => [recipe.recipe_id, recipe]),
      );

      for (const item of dto.items) {
        const recipe = recipesById.get(item.recipe_id);
        if (!recipe) {
          throw new BadRequestException('Recipe not found or inactive');
        }
        if (recipe.meal_type !== item.meal_type) {
          throw new BadRequestException(
            'Recipe meal type does not match the plan item',
          );
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
        const recipe = recipesById.get(item.recipe_id)!;
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

      const totalCalories = items.reduce(
        (sum, item) => sum + item.calories_snapshot,
        0,
      );
      const totalCost = items.reduce(
        (sum, item) => sum + item.cost_snapshot,
        0,
      );

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

  async delete(userId: string, planId: string) {
    const plan = await this.prisma.mealPlan.findUnique({
      where: { meal_plan_id: planId },
    });
    if (!plan) {
      throw new NotFoundException('Meal plan not found');
    }
    if (plan.user_id !== userId) {
      throw new ForbiddenException('You can only delete your own meal plan');
    }

    await this.prisma.mealPlan.delete({ where: { meal_plan_id: planId } });
    return { message: 'Meal plan deleted successfully' };
  }

  private validateUniqueMealTypes(items: MealPlanItemDto[]) {
    const mealTypes = items.map((item) => item.meal_type);
    if (new Set(mealTypes).size !== mealTypes.length) {
      throw new BadRequestException('Each meal type can only appear once');
    }
  }

  private parseDate(value?: string) {
    const dateValue = value ?? formatBangkokDateKey();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      throw new BadRequestException('Date must use YYYY-MM-DD format');
    }

    const date = parseDateOnly(dateValue);
    if (!date) {
      throw new BadRequestException('Invalid date');
    }
    return date;
  }
}
