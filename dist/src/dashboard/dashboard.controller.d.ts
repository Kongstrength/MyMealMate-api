import type { AuthenticatedRequest } from '../auth/jwt-auth.guard';
import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getDashboard(request: AuthenticatedRequest, date?: string): Promise<{
        date: string;
        user: {
            bmi: number;
            budget_daily: number;
            budget_weekly: number;
            budget_monthly: number;
            user_id: string;
            username: string;
            email: string;
            full_name: string;
            phone: string | null;
            age: number | null;
            gender: string | null;
            height: number | null;
            weight: number | null;
            birthday: Date | null;
            calories_per_day: number;
            daily_target_calories: number;
            activity_level: import("@prisma/client").$Enums.users_activity_level;
            liked_foods: import("@prisma/client/runtime/client").JsonValue;
            preferred_food_types: import("@prisma/client/runtime/client").JsonValue;
            health_goals_list: import("@prisma/client/runtime/client").JsonValue;
            disliked_foods: import("@prisma/client/runtime/client").JsonValue;
            food_allergies: import("@prisma/client/runtime/client").JsonValue;
        } & {
            is_profile_complete: boolean;
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
}
