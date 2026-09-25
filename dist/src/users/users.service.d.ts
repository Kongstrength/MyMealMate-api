import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailService } from '../mail/mail.service';
import { Prisma } from '@prisma/client';
export declare class UsersService {
    private readonly prisma;
    private readonly mailService;
    constructor(prisma: PrismaService, mailService: MailService);
    register(dto: CreateUserDto): Promise<{
        message: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    login(dto: LoginUserDto): Promise<{
        user: {
            user_id: string;
            username: string;
            email: string;
            full_name: string;
            phone: string | null;
            age: number | null;
            gender: string | null;
            height: number | null;
            weight: number | null;
            bmi: Prisma.Decimal;
            birthday: Date | null;
            is_active: boolean;
            created_at: Date;
            updated_at: Date;
            budget_daily: Prisma.Decimal;
            budget_weekly: Prisma.Decimal;
            budget_monthly: Prisma.Decimal;
            calories_per_day: number;
            daily_target_calories: number;
            activity_level: import("@prisma/client").$Enums.users_activity_level;
            liked_foods: Prisma.JsonValue | null;
            preferred_food_types: Prisma.JsonValue | null;
            health_goals_list: Prisma.JsonValue | null;
            google_id: string | null;
            is_email_verified: boolean;
            disliked_foods: Prisma.JsonValue | null;
            food_allergies: Prisma.JsonValue | null;
        } & {
            is_profile_complete: boolean;
        };
        accessToken: string;
    }>;
    findById(id: string): Promise<({
        user_id: string;
        username: string;
        email: string;
        full_name: string;
        phone: string | null;
        age: number | null;
        gender: string | null;
        height: number | null;
        weight: number | null;
        bmi: Prisma.Decimal;
        birthday: Date | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        budget_daily: Prisma.Decimal;
        budget_weekly: Prisma.Decimal;
        budget_monthly: Prisma.Decimal;
        calories_per_day: number;
        daily_target_calories: number;
        activity_level: import("@prisma/client").$Enums.users_activity_level;
        liked_foods: Prisma.JsonValue | null;
        preferred_food_types: Prisma.JsonValue | null;
        health_goals_list: Prisma.JsonValue | null;
        google_id: string | null;
        is_email_verified: boolean;
        disliked_foods: Prisma.JsonValue | null;
        food_allergies: Prisma.JsonValue | null;
    } & {
        is_profile_complete: boolean;
    }) | null>;
    findAll(): Promise<({
        user_id: string;
        username: string;
        email: string;
        full_name: string;
        phone: string | null;
        age: number | null;
        gender: string | null;
        height: number | null;
        weight: number | null;
        bmi: Prisma.Decimal;
        birthday: Date | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        budget_daily: Prisma.Decimal;
        budget_weekly: Prisma.Decimal;
        budget_monthly: Prisma.Decimal;
        calories_per_day: number;
        daily_target_calories: number;
        activity_level: import("@prisma/client").$Enums.users_activity_level;
        liked_foods: Prisma.JsonValue | null;
        preferred_food_types: Prisma.JsonValue | null;
        health_goals_list: Prisma.JsonValue | null;
        google_id: string | null;
        is_email_verified: boolean;
        disliked_foods: Prisma.JsonValue | null;
        food_allergies: Prisma.JsonValue | null;
    } & {
        is_profile_complete: boolean;
    })[]>;
    resendVerification(email: string): Promise<{
        message: string;
    }>;
    private signToken;
    private hashToken;
    update(id: string, dto: UpdateUserDto): Promise<{
        user_id: string;
        username: string;
        email: string;
        full_name: string;
        phone: string | null;
        age: number | null;
        gender: string | null;
        height: number | null;
        weight: number | null;
        bmi: Prisma.Decimal;
        birthday: Date | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        budget_daily: Prisma.Decimal;
        budget_weekly: Prisma.Decimal;
        budget_monthly: Prisma.Decimal;
        calories_per_day: number;
        daily_target_calories: number;
        activity_level: import("@prisma/client").$Enums.users_activity_level;
        liked_foods: Prisma.JsonValue | null;
        preferred_food_types: Prisma.JsonValue | null;
        health_goals_list: Prisma.JsonValue | null;
        google_id: string | null;
        is_email_verified: boolean;
        disliked_foods: Prisma.JsonValue | null;
        food_allergies: Prisma.JsonValue | null;
    } & {
        is_profile_complete: boolean;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
}
