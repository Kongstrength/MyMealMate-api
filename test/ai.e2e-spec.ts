import { randomBytes } from 'crypto';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

const describeAi = process.env.RUN_AI_E2E === '1' ? describe : describe.skip;

describeAi('AI meal plan (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  jest.setTimeout(120_000);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    app.setGlobalPrefix('api');
    await app.init();
    prisma = app.get(PrismaService);
  });

  it('logs in, recommends three meals, saves them, and reads them back', async () => {
    const email = 'ai-e2e-20260922@example.com';
    const password = randomBytes(24).toString('base64url');
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
      where: { email },
      create: {
        username: 'ai-e2e-20260922',
        email,
        password_hash: passwordHash,
        full_name: 'AI E2E Test User',
        activity_level: 'SEDENTARY',
        budget_daily: 300,
        calories_per_day: 2000,
        daily_target_calories: 2000,
        liked_foods: ['ไก่'],
        disliked_foods: ['หมู'],
        food_allergies: ['กุ้ง'],
        preferred_food_types: ['อาหารไทย'],
        is_email_verified: true,
      },
      update: {
        password_hash: passwordHash,
        budget_daily: 300,
        calories_per_day: 2000,
        daily_target_calories: 2000,
        liked_foods: ['ไก่'],
        disliked_foods: ['หมู'],
        food_allergies: ['กุ้ง'],
        preferred_food_types: ['อาหารไทย'],
        is_email_verified: true,
      },
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/api/users/login')
      .send({ email, password })
      .expect(201);

    const loginBody = loginResponse.body as { accessToken: string };
    const accessToken = loginBody.accessToken;
    expect(accessToken).toEqual(expect.any(String));

    const profileResponse = await request(app.getHttpServer())
      .patch(`/api/users/${user.user_id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        liked_foods: ['ไก่'],
        disliked_foods: ['หมู'],
        food_allergies: ['กุ้ง'],
        preferred_food_types: ['อาหารไทย'],
      })
      .expect(200);

    const profile = profileResponse.body as {
      liked_foods: string[];
      disliked_foods: string[];
      food_allergies: string[];
    };

    expect(profile.liked_foods).toEqual(['ไก่']);
    expect(profile.disliked_foods).toEqual(['หมู']);
    expect(profile.food_allergies).toEqual(['กุ้ง']);

    const recommendationResponse = await request(app.getHttpServer())
      .post('/api/ai/recommend-menu')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        budget: 300,
        meals_count: 3,
        preferences: 'อาหารไทยทั่วไป ไม่มีข้อจำกัดพิเศษ',
      });

    if (recommendationResponse.status !== 201) {
      console.error(
        JSON.stringify({
          status: recommendationResponse.status,
          error: recommendationResponse.body as unknown,
        }),
      );
    }
    expect(recommendationResponse.status).toBe(201);

    const recommendation = recommendationResponse.body as {
      daily_budget: number;
      total_estimated_cost: number;
      total_calories: number;
      meals: Array<{
        meal_type: string;
        menu_name: string;
        estimated_cost: number;
        calories: number;
        protein_g?: number;
        carbs_g?: number;
        fat_g?: number;
      }>;
    };

    expect(recommendation.daily_budget).toBe(300);
    expect(recommendation.meals).toHaveLength(3);
    expect(
      new Set(recommendation.meals.map((meal) => meal.meal_type)).size,
    ).toBe(3);
    expect(recommendation.total_estimated_cost).toBeLessThanOrEqual(300);
    expect(recommendation.total_calories).toBeGreaterThanOrEqual(1600);
    expect(recommendation.total_calories).toBeLessThanOrEqual(2400);
    expect(JSON.stringify(recommendation.meals)).not.toContain('กุ้ง');

    const saveResponse = await request(app.getHttpServer())
      .post('/api/ai/save-meal-plan')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ date: '2026-09-22', meals: recommendation.meals })
      .expect(201);

    const savedPlan = saveResponse.body as {
      meal_plan_id: string;
      user_id: string;
      total_calories: number;
      total_cost: string;
      meal_plan_items: Array<{
        calories_snapshot: number;
        cost_snapshot: string;
        meal_type: string;
      }>;
    };

    expect(savedPlan.user_id).toBe(user.user_id);
    expect(savedPlan.meal_plan_items).toHaveLength(3);
    expect(savedPlan.total_calories).toBe(
      savedPlan.meal_plan_items.reduce(
        (sum, item) => sum + item.calories_snapshot,
        0,
      ),
    );
    expect(Number(savedPlan.total_cost)).toBeCloseTo(
      savedPlan.meal_plan_items.reduce(
        (sum, item) => sum + Number(item.cost_snapshot),
        0,
      ),
      2,
    );

    const readResponse = await request(app.getHttpServer())
      .get('/api/meal-plans')
      .query({ date: '2026-09-22' })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const readPlan = readResponse.body as {
      meal_plan_id: string;
      meal_plan_items: unknown[];
    };

    expect(readPlan.meal_plan_id).toBe(savedPlan.meal_plan_id);
    expect(readPlan.meal_plan_items).toHaveLength(3);

    console.log(
      JSON.stringify({
        testUserEmail: email,
        mealPlanId: savedPlan.meal_plan_id,
        totalCost: Number(savedPlan.total_cost),
        totalCalories: savedPlan.total_calories,
        menuNames: recommendation.meals.map((meal) => meal.menu_name),
      }),
    );
  });

  afterAll(async () => {
    await app?.close();
  });
});
