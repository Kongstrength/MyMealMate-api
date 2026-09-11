import {IsInt , IsNumber, IsOptional, IsString,IsNotEmpty} from 'class-validator';
import type { Prisma } from '@prisma/client';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    full_name?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsNumber()
    age?: number;

    @IsOptional()
    @IsString()
    gender?: string;

    @IsOptional()
    @IsNumber()
    height?: number;

    @IsOptional()
    @IsNumber()
    weight?: number;

    @IsOptional()
    @IsNumber()
    bmi?: number;

    @IsOptional()
    birthday?: Date;

    @IsOptional()
    @IsString()
    activity_level?: 'SEDENTARY' | 'LIGHT_1_3' | 'MODERATE_3_5' | 'ACTIVE_6_7' | 'VERY_ACTIVE';

    @IsOptional()
    budget_daily?: number;

    @IsOptional()
    budget_weekly?: number;

    @IsOptional()
    budget_monthly?: number;

    @IsOptional()
    @IsInt()
    calories_per_day?: number;

    @IsOptional()
    @IsInt()
    daily_target_calories?: number;

    @IsOptional()
    liked_foods?: Prisma.InputJsonValue | null;

    @IsOptional()
    preferred_food_types?: Prisma.InputJsonValue | null;


    @IsOptional()
    health_goals_list?: Prisma.InputJsonValue | null;
}