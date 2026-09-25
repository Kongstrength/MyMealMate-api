import type { AuthenticatedRequest } from '../auth/jwt-auth.guard';
import { AiService } from './ai.service';
import { RecommendMenuDto } from './dto/recommend-menu.dto';
import { SaveMealPlanDto } from './dto/save-meal-plan.dto';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    recommendMenu(request: AuthenticatedRequest, dto: RecommendMenuDto): Promise<{
        daily_budget: number;
        total_estimated_cost: number;
        total_calories: number;
        meals: {
            meal_type: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";
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
        }[];
        market_summary: string;
    }>;
    saveMealPlan(request: AuthenticatedRequest, dto: SaveMealPlanDto): Promise<{
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
            meal_plan_id: string;
            sort_order: number;
            meal_plan_item_id: string;
            servings: import("@prisma/client-runtime-utils").Decimal;
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
}
