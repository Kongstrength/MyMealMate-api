import { BadRequestException } from '@nestjs/common';
import { MealPlanService } from './meal-plan.service';

describe('MealPlanService', () => {
  const mealPlan = { findMany: jest.fn(), findUnique: jest.fn() };
  const service = new MealPlanService({ mealPlan } as never);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns normalized plans for the requested user and date range', async () => {
    mealPlan.findMany.mockResolvedValue([
      {
        meal_plan_id: 'plan-1',
        plan_date: new Date('2026-09-21T00:00:00.000Z'),
        total_calories: 500,
        total_cost: 80,
        meal_plan_items: [
          {
            meal_plan_item_id: 'item-1',
            meal_type: 'LUNCH',
            servings: 1,
            calories_snapshot: 500,
            cost_snapshot: 80,
            recipe: {
              recipe_id: 'recipe-1',
              name: 'ข้าวกะเพราไก่',
              description: null,
              meal_type: 'LUNCH',
              calories: 500,
              protein_g: 30,
              carbs_g: 60,
              fat_g: 15,
              estimated_cost: 80,
              emoji: '🍛',
            },
          },
        ],
      },
    ]);

    const result = await service.findByRange(
      'user-1',
      '2026-09-21',
      '2026-09-27',
    );

    expect(mealPlan.findMany).toHaveBeenCalledTimes(1);
    expect(result.plans[0]).toEqual(
      expect.objectContaining({
        id: 'plan-1',
        date: '2026-09-21',
        totalCost: 80,
      }),
    );
    expect(result.plans[0].items[0].recipe.protein).toBe(30);
  });

  it('rejects ranges longer than 93 days', async () => {
    await expect(
      service.findByRange('user-1', '2026-01-01', '2026-05-01'),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(mealPlan.findMany).not.toHaveBeenCalled();
  });

  it('queries the exact requested calendar date without moving to the previous day', async () => {
    mealPlan.findUnique.mockResolvedValue(null);

    await service.findByDate('user-1', '2026-09-25');

    expect(mealPlan.findUnique).toHaveBeenCalledWith({
      where: {
        user_id_plan_date: {
          user_id: 'user-1',
          plan_date: new Date('2026-09-25T00:00:00.000Z'),
        },
      },
      include: {
        meal_plan_items: {
          orderBy: { sort_order: 'asc' },
          include: { recipe: true },
        },
      },
    });
  });
});
