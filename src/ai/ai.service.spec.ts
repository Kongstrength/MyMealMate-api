import { BadRequestException } from '@nestjs/common';
import { AiService } from './ai.service';

const validMeals = [
  {
    meal_type: 'BREAKFAST',
    menu_name: 'โจ๊กไก่',
    estimated_cost: 45,
    calories: 500,
    protein_g: 25,
    carbs_g: 60,
    fat_g: 12,
  },
  {
    meal_type: 'LUNCH',
    menu_name: 'ข้าวกะเพราไก่',
    estimated_cost: 65,
    calories: 700,
    protein_g: 35,
    carbs_g: 80,
    fat_g: 20,
  },
  {
    meal_type: 'DINNER',
    menu_name: 'แกงจืดเต้าหู้ไก่สับ',
    estimated_cost: 70,
    calories: 650,
    protein_g: 40,
    carbs_g: 55,
    fat_g: 22,
  },
];

describe('AiService', () => {
  type CompletionRequest = {
    messages: Array<{ content: string }>;
  };

  const prisma = {
    user: { findUnique: jest.fn() },
    $transaction: jest.fn(),
  };
  const marketPricesService = {
    findMocPrices: jest.fn(),
  };
  const createCompletion =
    jest.fn<(request: CompletionRequest) => Promise<unknown>>();
  let service: AiService;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.OPENAI_API_KEY = 'test-key';
    prisma.user.findUnique.mockResolvedValue({
      budget_daily: 200,
      daily_target_calories: 2000,
      calories_per_day: 0,
      health_goals_list: null,
      liked_foods: ['ไก่'],
      disliked_foods: ['หมู'],
      food_allergies: ['กุ้ง'],
      preferred_food_types: ['อาหารไทย'],
    });
    marketPricesService.findMocPrices.mockRejectedValue(
      new Error('market API unavailable'),
    );

    service = new AiService(prisma as never, marketPricesService as never);
    (service as unknown as { openai: unknown }).openai = {
      chat: { completions: { create: createCompletion } },
    };
  });

  it('validates the response and derives totals from the meals', async () => {
    createCompletion.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              total_estimated_cost: 999,
              total_calories: 999,
              meals: validMeals,
              market_summary: 'ราคาปกติ',
            }),
          },
        },
      ],
    });

    const result = await service.recommendMenu(
      'user-id',
      200,
      3,
      'อาหารไทยทั่วไป',
    );

    expect(result.total_estimated_cost).toBe(180);
    expect(result.total_calories).toBe(1850);
    expect(result.meals).toHaveLength(3);
    expect(createCompletion).toHaveBeenCalledTimes(1);
    const calls = createCompletion.mock
      .calls as unknown as CompletionRequest[][];
    const request = calls[0][0];
    const prompt = request.messages[1].content;
    expect(prompt).toContain('อาหารที่ชอบ: ไก่');
    expect(prompt).toContain('อาหารที่ไม่ชอบ (ควรหลีกเลี่ยง): หมู');
    expect(prompt).toContain('อาหารที่แพ้ (ห้ามใช้เด็ดขาด): กุ้ง');
    expect(prompt).toContain('ประเภทอาหารที่ชอบ: อาหารไทย');
  });

  it('retries once when AI returns duplicate meal types', async () => {
    createCompletion
      .mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify({
                meals: validMeals.map((meal) => ({
                  ...meal,
                  meal_type: 'BREAKFAST',
                })),
              }),
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify({ meals: validMeals }),
            },
          },
        ],
      });

    const result = await service.recommendMenu('user-id', 200, 3);

    expect(result.meals).toHaveLength(3);
    expect(createCompletion).toHaveBeenCalledTimes(2);
  });

  it('retries when AI returns a meal containing a food allergen', async () => {
    createCompletion
      .mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify({
                meals: [
                  {
                    ...validMeals[0],
                    menu_name: 'ข้าวผัดกุ้ง',
                    ingredients: [
                      { name: 'กุ้ง', amount: '100 กรัม', estimated_price: 40 },
                    ],
                  },
                  validMeals[1],
                  validMeals[2],
                ],
              }),
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify({ meals: validMeals }),
            },
          },
        ],
      });

    const result = await service.recommendMenu('user-id', 200, 3);

    expect(result.meals).toHaveLength(3);
    expect(createCompletion).toHaveBeenCalledTimes(2);
  });

  it('retries when AI returns a disliked food', async () => {
    createCompletion
      .mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify({
                meals: [
                  validMeals[0],
                  {
                    ...validMeals[1],
                    menu_name: 'ข้าวกะเพราหมู',
                    ingredients: [
                      { name: 'หมู', amount: '100 กรัม', estimated_price: 35 },
                    ],
                  },
                  validMeals[2],
                ],
              }),
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify({ meals: validMeals }),
            },
          },
        ],
      });

    const result = await service.recommendMenu('user-id', 200, 3);

    expect(result.meals).toHaveLength(3);
    expect(createCompletion).toHaveBeenCalledTimes(2);
  });

  it('rejects duplicate meal types before starting a transaction', async () => {
    await expect(
      service.saveMealPlan(
        'user-id',
        [validMeals[0], { ...validMeals[1], meal_type: 'BREAKFAST' }],
        '2026-09-22',
      ),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
