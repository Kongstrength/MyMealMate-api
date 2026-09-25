import { PrismaService } from '../prisma/prisma.service';
import { MarketPricesService } from '../market-prices/market-prices.service';
declare const MEAL_TYPES: readonly ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];
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
export declare class AiService {
    private readonly prisma;
    private readonly marketPricesService;
    private openai;
    constructor(prisma: PrismaService, marketPricesService: MarketPricesService);
    recommendMenu(userId: string, budget?: number, mealsCount?: number, preferences?: string): Promise<{
        daily_budget: number;
        total_estimated_cost: number;
        total_calories: number;
        meals: AiMeal[];
        market_summary: string;
    }>;
    private fetchAllMocPrices;
    private buildPrompt;
    private requestRecommendation;
    private callOpenAi;
    private parseAiResponse;
    private validateRecommendation;
    private containsRestrictedFood;
    private toStringArray;
    private isNonNegativeNumber;
    private isOptionalNonNegativeNumber;
    private isBillingOrQuotaError;
    private isRetryableError;
    private toOpenAiException;
    saveMealPlan(userId: string, meals: Array<{
        meal_type: string;
        menu_name: string;
        estimated_cost: number;
        calories: number;
        protein_g?: number;
        carbs_g?: number;
        fat_g?: number;
    }>, requestedDate?: string): Promise<{
        meal_plan_items: ({
            recipe: {
                is_active: boolean;
                created_at: Date;
                updated_at: Date;
                recipe_id: string;
                name: string;
                description: string | null;
                meal_type: string;
                calories: number;
                protein_g: import("@prisma/client-runtime-utils").Decimal;
                carbs_g: import("@prisma/client-runtime-utils").Decimal;
                fat_g: import("@prisma/client-runtime-utils").Decimal;
                estimated_cost: import("@prisma/client-runtime-utils").Decimal;
                emoji: string | null;
            };
        } & {
            created_at: Date;
            updated_at: Date;
            recipe_id: string;
            meal_type: string;
            servings: import("@prisma/client-runtime-utils").Decimal;
            meal_plan_id: string;
            sort_order: number;
            meal_plan_item_id: string;
            calories_snapshot: number;
            cost_snapshot: import("@prisma/client-runtime-utils").Decimal;
        })[];
    } & {
        user_id: string;
        created_at: Date;
        updated_at: Date;
        meal_plan_id: string;
        plan_date: Date;
        total_calories: number;
        total_cost: import("@prisma/client-runtime-utils").Decimal;
    }>;
    private validateMealsForSave;
    private mealTypeEmoji;
}
export {};
