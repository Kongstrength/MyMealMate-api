import { PrismaService } from '../prisma/prisma.service';
import { UpsertMealPlanDto } from './dto/upsert-meal-plan.dto';
export declare class MealPlanService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByDate(userId: string, requestedDate?: string): Promise<({
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
    }) | null>;
    upsert(userId: string, requestedDate: string | undefined, dto: UpsertMealPlanDto): Promise<{
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
    delete(userId: string, planId: string): Promise<{
        message: string;
    }>;
    private validateUniqueMealTypes;
    private parseDate;
    private formatDate;
}
