export declare class CreateUserDto {
    username: string;
    email: string;
    password: string;
    full_name?: string;
    phone?: string;
    age?: number;
    gender?: string;
    height?: number;
    weight?: number;
    bmi?: number;
    birthday: string;
    activity_level?: 'SEDENTARY' | 'LIGHT_1_3' | 'MODERATE_3_5' | 'ACTIVE_6_7' | 'VERY_ACTIVE';
    budget_daily?: number;
    budget_weekly?: number;
    budget_monthly?: number;
    calories_per_day?: number;
    daily_target_calories?: number;
    liked_foods?: string[];
    disliked_foods?: string[];
    food_allergies?: string[];
    preferred_food_types?: string[];
    health_goals_list?: string[];
}
