import type { Prisma } from '@prisma/client';
export declare class UpdateUserDto {
    full_name?: string;
    phone?: string;
    age?: number;
    gender?: string;
    height?: number;
    weight?: number;
    bmi?: number;
    birthday?: Date;
    activity_level?: 'SEDENTARY' | 'LIGHT_1_3' | 'MODERATE_3_5' | 'ACTIVE_6_7' | 'VERY_ACTIVE';
    budget_daily?: number;
    budget_weekly?: number;
    budget_monthly?: number;
    calories_per_day?: number;
    daily_target_calories?: number;
    liked_foods?: Prisma.InputJsonValue | null;
    preferred_food_types?: Prisma.InputJsonValue | null;
    health_goals_list?: Prisma.InputJsonValue | null;
}
