import * as bcrypt from 'bcrypt';
import { DashboardService } from '../dashboard/dashboard.service';
import { UsersService } from './users.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('profile completeness in user responses', () => {
  const completeUser = {
    user_id: 'user-id',
    username: 'complete-user',
    email: 'complete@example.com',
    password_hash: 'hash',
    full_name: 'Complete User',
    phone: null,
    age: 30,
    gender: '',
    height: 175,
    weight: 70,
    bmi: 22.86,
    birthday: null,
    activity_level: 'SEDENTARY',
    budget_daily: 200,
    budget_weekly: 1400,
    budget_monthly: 6000,
    calories_per_day: 0,
    daily_target_calories: 2000,
    liked_foods: null,
    disliked_foods: null,
    food_allergies: null,
    preferred_food_types: null,
    health_goals_list: null,
    google_id: null,
    is_active: true,
    is_email_verified: true,
    created_at: new Date('2026-01-01T00:00:00.000Z'),
    updated_at: new Date('2026-01-01T00:00:00.000Z'),
  };

  const prisma = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    mealPlan: { findUnique: jest.fn() },
  };
  const mailService = {};
  const mealPlanService = { findByDate: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.user.findUnique.mockResolvedValue(completeUser);
    prisma.user.update.mockResolvedValue(completeUser);
    prisma.mealPlan.findUnique.mockResolvedValue(null);
    mealPlanService.findByDate.mockResolvedValue(null);
    jest.mocked(bcrypt.compare).mockResolvedValue(true as never);
  });

  it('returns the same true status from login, profile GET/PATCH, and dashboard', async () => {
    const usersService = new UsersService(
      prisma as never,
      mailService as never,
    );
    const dashboardService = new DashboardService(
      prisma as never,
      mealPlanService as never,
    );

    const login = await usersService.login({
      email: completeUser.email,
      password: 'password',
    });
    const profile = await usersService.findById(completeUser.user_id);
    const updatedProfile = await usersService.update(completeUser.user_id, {});
    const dashboard = await dashboardService.getDashboard(
      completeUser.user_id,
      '2026-09-22',
    );

    expect(login.user.is_profile_complete).toBe(true);
    expect(profile?.is_profile_complete).toBe(true);
    expect(updatedProfile.is_profile_complete).toBe(true);
    expect(dashboard.user.is_profile_complete).toBe(true);
    expect(dashboard.user).toMatchObject({
      age: 30,
      gender: '',
      height: 175,
      weight: 70,
      birthday: null,
      activity_level: 'SEDENTARY',
    });
  });

  it('returns true immediately when PATCH completes the required data', async () => {
    prisma.user.update.mockResolvedValueOnce({
      ...completeUser,
      daily_target_calories: 2100,
    });

    const usersService = new UsersService(
      prisma as never,
      mailService as never,
    );
    const result = await usersService.update(completeUser.user_id, {
      daily_target_calories: 2100,
    });

    expect(result.is_profile_complete).toBe(true);
  });

  it('uses the shared meal-plan service for the dashboard menu', async () => {
    mealPlanService.findByDate.mockResolvedValueOnce({
      meal_plan_id: 'plan-id',
      total_calories: 1650,
      total_cost: 210,
      meal_plan_items: [
        {
          meal_plan_item_id: 'item-id',
          meal_type: 'BREAKFAST',
          servings: 1,
          calories_snapshot: 250,
          cost_snapshot: 35,
          recipe: {
            recipe_id: 'recipe-id',
            name: 'โยเกิร์ตผลไม้',
            description: null,
            meal_type: 'BREAKFAST',
            calories: 250,
            protein_g: 12,
            carbs_g: 40,
            fat_g: 5,
            estimated_cost: 35,
            emoji: '🥣',
          },
        },
      ],
    });
    const dashboardService = new DashboardService(
      prisma as never,
      mealPlanService as never,
    );

    const dashboard = await dashboardService.getDashboard(
      completeUser.user_id,
      '2026-09-25',
    );

    expect(mealPlanService.findByDate).toHaveBeenCalledWith(
      completeUser.user_id,
      '2026-09-25',
    );
    expect(dashboard.mealPlan?.items[0]).toMatchObject({
      mealType: 'BREAKFAST',
      calories: 250,
      cost: 35,
      recipe: { name: 'โยเกิร์ตผลไม้' },
    });
  });
});
