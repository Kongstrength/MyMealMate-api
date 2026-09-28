import type { AuthenticatedRequest } from '../auth/jwt-auth.guard';
import { UpsertMealPlanDto } from './dto/upsert-meal-plan.dto';
import { MealPlanService } from './meal-plan.service';
export declare class MealPlanController {
    private readonly mealPlanService;
    constructor(mealPlanService: MealPlanService);
    findByRange(request: AuthenticatedRequest, from?: string, to?: string): Promise<{
        from: string;
        to: string;
        plans: {
            id: string;
            date: string;
            totalCalories: number;
            totalCost: number;
            items: {
                id: string;
                mealType: string;
                servings: number;
                calories: number;
                cost: number;
                recipe: {
                    id: string;
                    name: string;
                    description: string | null;
                    mealType: string;
                    calories: number;
                    protein: number;
                    carbs: number;
                    fat: number;
                    estimatedCost: number;
                    emoji: string | null;
                };
            }[];
        }[];
    }>;
    findByDate(request: AuthenticatedRequest, date?: string): Promise<({
        meal_plan_items: ({
            recipe: {
                is_active: boolean;
                created_at: Date;
                updated_at: Date;
                name: string;
                description: string | null;
                meal_type: string;
                calories: number;
                protein_g: import("@prisma/client-runtime-utils").Decimal;
                carbs_g: import("@prisma/client-runtime-utils").Decimal;
                fat_g: import("@prisma/client-runtime-utils").Decimal;
                estimated_cost: import("@prisma/client-runtime-utils").Decimal;
                emoji: string | null;
                cooking_tips: string | null;
                recipe_id: string;
                source: import("@prisma/client").$Enums.recipe_source;
            };
        } & {
            created_at: Date;
            updated_at: Date;
            meal_type: string;
            recipe_id: string;
            sort_order: number;
            servings: import("@prisma/client-runtime-utils").Decimal;
            meal_plan_id: string;
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
    }) | null>;
    upsert(request: AuthenticatedRequest, date: string, dto: UpsertMealPlanDto): Promise<{
        meal_plan_items: ({
            recipe: {
                is_active: boolean;
                created_at: Date;
                updated_at: Date;
                name: string;
                description: string | null;
                meal_type: string;
                calories: number;
                protein_g: import("@prisma/client-runtime-utils").Decimal;
                carbs_g: import("@prisma/client-runtime-utils").Decimal;
                fat_g: import("@prisma/client-runtime-utils").Decimal;
                estimated_cost: import("@prisma/client-runtime-utils").Decimal;
                emoji: string | null;
                cooking_tips: string | null;
                recipe_id: string;
                source: import("@prisma/client").$Enums.recipe_source;
            };
        } & {
            created_at: Date;
            updated_at: Date;
            meal_type: string;
            recipe_id: string;
            sort_order: number;
            servings: import("@prisma/client-runtime-utils").Decimal;
            meal_plan_id: string;
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
    delete(request: AuthenticatedRequest, id: string): Promise<{
        message: string;
    }>;
}
