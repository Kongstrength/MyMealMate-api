import {
  BadRequestException,
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaService } from '../prisma/prisma.service';
import { MarketPricesService } from '../market-prices/market-prices.service';
import { formatBangkokDateKey, parseDateOnly } from '../date.utils';

/**
 * MOC Category IDs (กระทรวงพาณิชย์)
 * 1 = เนื้อสัตว์ (Meat)
 * 2 = สัตว์น้ำ (Seafood)
 * 3 = ผักสด (Vegetables)
 * 5 = พืชอาหาร (Food Crops: rice, eggs, oil, seasoning)
 */
const MOC_CATEGORIES = [
  { id: 1, name: 'เนื้อสัตว์ (Meat)' },
  { id: 2, name: 'สัตว์น้ำ (Seafood)' },
  { id: 3, name: 'ผักสด (Vegetables)' },
  { id: 5, name: 'พืชอาหาร (Food Crops)' },
] as const;

type MocPriceItem = {
  name: string;
  average_price: number;
  unit: string;
};

type CategoryPrices = {
  category: string;
  items: MocPriceItem[];
};

const MEAL_TYPES = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'] as const;
const NON_RETRYABLE_OPENAI_CODES = new Set([
  'credit_balance_exhausted',
  'organization_spend_limit_exceeded',
  'project_spend_limit_exceeded',
  'organization_usage_limit_exceeded',
]);

type AiMeal = {
  meal_type: (typeof MEAL_TYPES)[number];
  menu_name: string;
  description?: string;
  ingredients?: Array<{
    name: string;
    amount: string;
    estimated_price: number;
  }>;
  estimated_cost: number;
  calories: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  cooking_tips?: string;
};

type AiRecommendation = {
  total_estimated_cost: number;
  total_calories: number;
  meals: AiMeal[];
  market_summary?: string;
};

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(
    private readonly prisma: PrismaService,
    private readonly marketPricesService: MarketPricesService,
  ) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }
    this.openai = new OpenAI({ apiKey, maxRetries: 0 });
  }

  async recommendMenu(
    userId: string,
    budget?: number,
    mealsCount = 3,
    preferences?: string,
  ) {
    // 1) Load user profile
    const user = await this.prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2) Determine daily budget
    const dailyBudget = budget ?? (Number(user.budget_daily) || 200);

    // 3) Fetch MOC prices (parallel, with graceful fallback)
    const marketPrices = await this.fetchAllMocPrices();

    // 4) Build prompt context
    const foodAllergies = this.toStringArray(user.food_allergies);
    const dislikedFoods = this.toStringArray(user.disliked_foods);
    const prompt = this.buildPrompt({
      dailyBudget,
      mealsCount,
      caloriesTarget:
        user.daily_target_calories || user.calories_per_day || 2000,
      healthGoals: this.toStringArray(user.health_goals_list),
      likedFoods: this.toStringArray(user.liked_foods),
      dislikedFoods,
      foodAllergies,
      preferredFoodTypes: this.toStringArray(user.preferred_food_types),
      preferences,
      marketPrices,
    });

    // 5) Call OpenAI and retry at most once for transient/invalid responses.
    return this.requestRecommendation(
      prompt,
      dailyBudget,
      mealsCount,
      foodAllergies,
      dislikedFoods,
    );
  }

  private async fetchAllMocPrices(): Promise<CategoryPrices[]> {
    const today = formatBangkokDateKey();

    const results = await Promise.allSettled(
      MOC_CATEGORIES.map(async (cat) => {
        const data = await this.marketPricesService.findMocPrices(
          today,
          cat.id,
          'R',
          0,
          50,
        );
        return {
          category: cat.name,
          items: data.items.map((item) => ({
            name: item.name,
            average_price: item.average_price,
            unit: item.unit,
          })),
        };
      }),
    );

    const fulfilled: CategoryPrices[] = [];
    for (const r of results) {
      if (r.status === 'fulfilled') {
        fulfilled.push(r.value);
      }
    }
    return fulfilled;
  }

  private buildPrompt(context: {
    dailyBudget: number;
    mealsCount: number;
    caloriesTarget: number;
    healthGoals: string[] | null;
    likedFoods: string[] | null;
    dislikedFoods: string[] | null;
    foodAllergies: string[] | null;
    preferredFoodTypes: string[] | null;
    preferences?: string;
    marketPrices: CategoryPrices[];
  }): string {
    const perMealBudget =
      Math.floor((context.dailyBudget / context.mealsCount) * 100) / 100;
    const priceSection = context.marketPrices
      .map((cat) => {
        const items = cat.items
          .slice(0, 15) // Limit per category to keep prompt short
          .map((i) => `  - ${i.name}: ${i.average_price} บาท/${i.unit}`)
          .join('\n');
        return `### ${cat.category}\n${items}`;
      })
      .join('\n\n');

    const healthGoals = context.healthGoals?.length
      ? `เป้าหมายสุขภาพ: ${context.healthGoals.join(', ')}`
      : '';

    const likedFoods = context.likedFoods?.length
      ? `อาหารที่ชอบ: ${context.likedFoods.join(', ')}`
      : '';

    const dislikedFoods = context.dislikedFoods?.length
      ? `อาหารที่ไม่ชอบ (ควรหลีกเลี่ยง): ${context.dislikedFoods.join(', ')}`
      : '';

    const foodAllergies = context.foodAllergies?.length
      ? `อาหารที่แพ้ (ห้ามใช้เด็ดขาด): ${context.foodAllergies.join(', ')}`
      : '';

    const preferredFoodTypes = context.preferredFoodTypes?.length
      ? `ประเภทอาหารที่ชอบ: ${context.preferredFoodTypes.join(', ')}`
      : '';

    const userPreferences = context.preferences
      ? `ความต้องการเพิ่มเติม: ${context.preferences}`
      : '';

    return `คุณเป็นนักโภชนาการผู้เชี่ยวชาญอาหารไทย ช่วยแนะนำเมนูอาหารตามเงื่อนไขต่อไปนี้:

## ข้อมูลผู้ใช้
- งบประมาณต่อวัน: ${context.dailyBudget} บาท
- เป้าหมายแคลอรี่ต่อวัน: ${context.caloriesTarget} kcal
- จำนวนมื้อ: ${context.mealsCount} มื้อ
${healthGoals}
${likedFoods}
${dislikedFoods}
${foodAllergies}
${preferredFoodTypes}
${userPreferences}

## ราคาวัตถุดิบวันนี้ (จากกระทรวงพาณิชย์)
${priceSection}

## กฎ
1. แนะนำเมนูจำนวน ${context.mealsCount} มื้อ (เช้า/กลางวัน/เย็น ตามจำนวนมื้อ)
2. ราคารวมทุกมื้อต้อง **ไม่เกิน ${context.dailyBudget} บาท**
3. ราคาแต่ละมื้อต้องไม่เกิน ${perMealBudget} บาท เพื่อให้ผลรวมอยู่ในงบ
4. คำนวณผลรวมราคาจาก estimated_cost ของทุกมื้ออีกครั้งก่อนตอบ
5. แคลอรี่รวมควรใกล้เคียง ${context.caloriesTarget} kcal
6. ใช้ราคาวัตถุดิบจริงจากข้อมูลด้านบนในการคำนวณ
7. ระบุส่วนผสมหลักพร้อมปริมาณและราคาโดยประมาณ
8. ให้เคล็ดลับการทำอาหารสั้นๆ
9. ห้ามใช้วัตถุดิบในรายการอาหารที่แพ้โดยเด็ดขาด และควรหลีกเลี่ยงรายการอาหารที่ไม่ชอบ
10. หากข้อมูลขัดกัน ให้เรียงความสำคัญ: อาหารที่แพ้ > อาหารที่ไม่ชอบ > อาหารที่ชอบ

ตอบเป็น JSON เท่านั้น ตามรูปแบบนี้:
{
  "total_estimated_cost": number,
  "total_calories": number,
  "meals": [
    {
      "meal_type": "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK",
      "menu_name": "ชื่อเมนู",
      "description": "คำอธิบายสั้นๆ",
      "ingredients": [
        { "name": "ชื่อวัตถุดิบ", "amount": "ปริมาณ", "estimated_price": number }
      ],
      "estimated_cost": number,
      "calories": number,
      "protein_g": number,
      "carbs_g": number,
      "fat_g": number,
      "cooking_tips": "เคล็ดลับ"
    }
  ],
  "market_summary": "สรุปภาพรวมราคาตลาดวันนี้"
}`;
  }

  private async requestRecommendation(
    prompt: string,
    dailyBudget: number,
    mealsCount: number,
    foodAllergies: string[] | null,
    dislikedFoods: string[] | null,
  ) {
    let lastError: unknown;

    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const retryInstruction =
          attempt === 0
            ? ''
            : '\n\nคำตอบก่อนหน้าไม่ผ่าน validation กรุณาตรวจจำนวนมื้อ ประเภทมื้อที่ห้ามซ้ำ ตัวเลขทั้งหมด งบรวม อาหารที่แพ้ และอาหารที่ไม่ชอบ แล้วตอบ JSON ใหม่ทั้งหมด';
        const raw = await this.callOpenAi(`${prompt}${retryInstruction}`);
        return this.parseAiResponse(
          raw,
          dailyBudget,
          mealsCount,
          foodAllergies,
          dislikedFoods,
        );
      } catch (error) {
        lastError = error;

        if (this.isBillingOrQuotaError(error)) {
          throw this.toOpenAiException(error);
        }

        if (attempt === 1 || !this.isRetryableError(error)) {
          break;
        }
      }
    }

    if (lastError instanceof BadGatewayException) {
      throw lastError;
    }
    throw this.toOpenAiException(lastError);
  }

  private async callOpenAi(prompt: string): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a Thai meal planning assistant. Always respond with valid JSON only, no markdown.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    });

    const text = completion.choices[0]?.message?.content;
    if (!text) {
      throw new BadGatewayException('AI returned an empty response');
    }
    return text;
  }

  private parseAiResponse(
    raw: string,
    dailyBudget: number,
    mealsCount: number,
    foodAllergies: string[] | null,
    dislikedFoods: string[] | null,
  ) {
    try {
      // Strip markdown code fences if present
      const cleaned = raw
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      const data = JSON.parse(cleaned) as AiRecommendation;
      this.validateRecommendation(
        data,
        dailyBudget,
        mealsCount,
        foodAllergies,
        dislikedFoods,
      );

      const totalEstimatedCost = Number(
        data.meals
          .reduce((sum, meal) => sum + meal.estimated_cost, 0)
          .toFixed(2),
      );
      const totalCalories = data.meals.reduce(
        (sum, meal) => sum + meal.calories,
        0,
      );

      return {
        daily_budget: dailyBudget,
        total_estimated_cost: totalEstimatedCost,
        total_calories: totalCalories,
        meals: data.meals,
        market_summary: data.market_summary ?? '',
      };
    } catch (error) {
      if (error instanceof BadGatewayException) {
        throw error;
      }
      throw new BadGatewayException(
        'AI ตอบกลับในรูปแบบที่ไม่ถูกต้อง กรุณาลองใหม่',
      );
    }
  }

  private validateRecommendation(
    data: AiRecommendation,
    dailyBudget: number,
    mealsCount: number,
    foodAllergies: string[] | null,
    dislikedFoods: string[] | null,
  ) {
    if (
      !data ||
      !Array.isArray(data.meals) ||
      data.meals.length !== mealsCount
    ) {
      throw new BadGatewayException('AI returned an invalid number of meals');
    }

    const mealTypes = new Set<string>();
    for (const meal of data.meals) {
      if (
        !MEAL_TYPES.includes(meal.meal_type) ||
        mealTypes.has(meal.meal_type) ||
        typeof meal.menu_name !== 'string' ||
        !meal.menu_name.trim() ||
        !this.isNonNegativeNumber(meal.estimated_cost) ||
        !this.isNonNegativeNumber(meal.calories) ||
        !this.isOptionalNonNegativeNumber(meal.protein_g) ||
        !this.isOptionalNonNegativeNumber(meal.carbs_g) ||
        !this.isOptionalNonNegativeNumber(meal.fat_g)
      ) {
        throw new BadGatewayException('AI returned invalid meal data');
      }
      mealTypes.add(meal.meal_type);
    }

    const totalCost = data.meals.reduce(
      (sum, meal) => sum + meal.estimated_cost,
      0,
    );
    if (totalCost > dailyBudget + 0.01) {
      throw new BadGatewayException('AI meal plan exceeds the daily budget');
    }

    if (this.containsRestrictedFood(data, foodAllergies)) {
      throw new BadGatewayException('AI meal plan contains a food allergen');
    }

    if (this.containsRestrictedFood(data, dislikedFoods)) {
      throw new BadGatewayException('AI meal plan contains a disliked food');
    }
  }

  private containsRestrictedFood(
    data: AiRecommendation,
    foodAllergies: string[] | null,
  ) {
    if (!foodAllergies?.length) {
      return false;
    }

    const recommendationText = data.meals
      .flatMap((meal) => [
        meal.menu_name,
        meal.description ?? '',
        ...(meal.ingredients?.map((ingredient) => ingredient.name) ?? []),
      ])
      .join(' ')
      .toLocaleLowerCase('th-TH');

    return foodAllergies.some((allergy) => {
      const normalized = allergy.trim().toLocaleLowerCase('th-TH');
      return normalized.length > 0 && recommendationText.includes(normalized);
    });
  }

  private toStringArray(value: unknown): string[] | null {
    if (!Array.isArray(value)) {
      return null;
    }

    const values = value
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean);
    return values.length > 0 ? values : null;
  }

  private isNonNegativeNumber(value: unknown): value is number {
    return typeof value === 'number' && Number.isFinite(value) && value >= 0;
  }

  private isOptionalNonNegativeNumber(value: unknown) {
    return value === undefined || this.isNonNegativeNumber(value);
  }

  private isBillingOrQuotaError(error: unknown) {
    return (
      error instanceof OpenAI.APIError &&
      typeof error.code === 'string' &&
      NON_RETRYABLE_OPENAI_CODES.has(error.code)
    );
  }

  private isRetryableError(error: unknown) {
    if (error instanceof BadGatewayException) {
      return true;
    }
    if (error instanceof OpenAI.APIConnectionError) {
      return true;
    }
    return (
      error instanceof OpenAI.APIError &&
      (error.status === 429 || (error.status ?? 0) >= 500)
    );
  }

  private toOpenAiException(error: unknown) {
    const code =
      error instanceof OpenAI.APIError
        ? (error.code ?? 'openai_api_error')
        : 'openai_connection_error';

    console.error('[AiService] OpenAI request failed:', code);
    return new BadGatewayException({
      message: 'ไม่สามารถเชื่อมต่อ AI ได้ กรุณาลองใหม่อีกครั้ง',
      code,
    });
  }

  async saveMealPlan(
    userId: string,
    meals: Array<{
      meal_type: string;
      menu_name: string;
      estimated_cost: number;
      calories: number;
      protein_g?: number;
      carbs_g?: number;
      fat_g?: number;
    }>,
    requestedDate?: string,
  ) {
    this.validateMealsForSave(meals);

    const dateValue = requestedDate ?? formatBangkokDateKey();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      throw new BadRequestException('Date must use YYYY-MM-DD format');
    }
    const planDate = parseDateOnly(dateValue);
    if (!planDate) {
      throw new BadRequestException('Invalid date');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1) Upsert recipes from AI results
      const recipeIds: string[] = [];
      for (const meal of meals) {
        const recipe = await tx.recipe.upsert({
          where: {
            name_meal_type: {
              name: meal.menu_name,
              meal_type: meal.meal_type,
            },
          },
          create: {
            name: meal.menu_name,
            meal_type: meal.meal_type,
            calories: meal.calories,
            protein_g: meal.protein_g ?? 0,
            carbs_g: meal.carbs_g ?? 0,
            fat_g: meal.fat_g ?? 0,
            estimated_cost: meal.estimated_cost,
            emoji: this.mealTypeEmoji(meal.meal_type),
            description: 'สร้างโดย AI',
          },
          update: {
            calories: meal.calories,
            protein_g: meal.protein_g ?? 0,
            carbs_g: meal.carbs_g ?? 0,
            fat_g: meal.fat_g ?? 0,
            estimated_cost: meal.estimated_cost,
          },
        });
        recipeIds.push(recipe.recipe_id);
      }

      // 2) Upsert meal plan for the date
      const mealPlan = await tx.mealPlan.upsert({
        where: {
          user_id_plan_date: {
            user_id: userId,
            plan_date: planDate,
          },
        },
        create: { user_id: userId, plan_date: planDate },
        update: {},
      });

      // 3) Delete old items and create new ones
      await tx.mealPlanItem.deleteMany({
        where: { meal_plan_id: mealPlan.meal_plan_id },
      });

      const items = meals.map((meal, index) => ({
        meal_plan_id: mealPlan.meal_plan_id,
        recipe_id: recipeIds[index],
        meal_type: meal.meal_type,
        servings: 1,
        calories_snapshot: meal.calories,
        cost_snapshot: meal.estimated_cost,
        sort_order: index,
      }));

      if (items.length > 0) {
        await tx.mealPlanItem.createMany({ data: items });
      }

      const totalCalories = items.reduce(
        (sum, item) => sum + item.calories_snapshot,
        0,
      );
      const totalCost = items.reduce(
        (sum, item) => sum + item.cost_snapshot,
        0,
      );

      return tx.mealPlan.update({
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

  private validateMealsForSave(meals: Array<{ meal_type: string }>) {
    if (meals.length === 0 || meals.length > MEAL_TYPES.length) {
      throw new BadRequestException('Meal plan must contain 1 to 4 meals');
    }

    const mealTypes = meals.map((meal) => meal.meal_type);
    if (new Set(mealTypes).size !== mealTypes.length) {
      throw new BadRequestException('Each meal type can only appear once');
    }
  }

  private mealTypeEmoji(mealType: string): string {
    const map: Record<string, string> = {
      BREAKFAST: '🌅',
      LUNCH: '☀️',
      DINNER: '🌙',
      SNACK: '🍪',
    };
    return map[mealType] ?? '🍽';
  }
}
