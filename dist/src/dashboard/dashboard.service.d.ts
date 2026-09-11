import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboard(userId: string, requestedDate?: string): Promise<{
        date: string;
        user: {
            budget_daily: number;
            budget_weekly: number;
            budget_monthly: number;
            user_id: string;
            username: string;
            full_name: string;
            daily_target_calories: number;
            liked_foods: import("@prisma/client/runtime/client").JsonValue;
            preferred_food_types: import("@prisma/client/runtime/client").JsonValue;
            health_goals_list: import("@prisma/client/runtime/client").JsonValue;
        };
        mealPlan: {
            id: string;
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
        } | null;
    }>;
    private parseDate;
    private formatDate;
}
