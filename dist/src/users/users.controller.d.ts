import type { AuthenticatedRequest } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(dto: CreateUserDto): Promise<{
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
            bmi: import("@prisma/client-runtime-utils").Decimal;
            birthday: Date | null;
            is_active: boolean;
            created_at: Date;
            updated_at: Date;
            budget_daily: import("@prisma/client-runtime-utils").Decimal;
            budget_weekly: import("@prisma/client-runtime-utils").Decimal;
            budget_monthly: import("@prisma/client-runtime-utils").Decimal;
            calories_per_day: number;
            daily_target_calories: number;
            activity_level: import("@prisma/client").$Enums.users_activity_level;
            liked_foods: import("@prisma/client/runtime/client").JsonValue | null;
            preferred_food_types: import("@prisma/client/runtime/client").JsonValue | null;
            health_goals_list: import("@prisma/client/runtime/client").JsonValue | null;
            google_id: string | null;
            is_email_verified: boolean;
            disliked_foods: import("@prisma/client/runtime/client").JsonValue | null;
            food_allergies: import("@prisma/client/runtime/client").JsonValue | null;
        } & {
            is_profile_complete: boolean;
        };
        accessToken: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    resendVerification(dto: ResendVerificationDto): Promise<{
        message: string;
    }>;
    getAllUsers(): Promise<({
        user_id: string;
        username: string;
        email: string;
        full_name: string;
        phone: string | null;
        age: number | null;
        gender: string | null;
        height: number | null;
        weight: number | null;
        bmi: import("@prisma/client-runtime-utils").Decimal;
        birthday: Date | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        budget_daily: import("@prisma/client-runtime-utils").Decimal;
        budget_weekly: import("@prisma/client-runtime-utils").Decimal;
        budget_monthly: import("@prisma/client-runtime-utils").Decimal;
        calories_per_day: number;
        daily_target_calories: number;
        activity_level: import("@prisma/client").$Enums.users_activity_level;
        liked_foods: import("@prisma/client/runtime/client").JsonValue | null;
        preferred_food_types: import("@prisma/client/runtime/client").JsonValue | null;
        health_goals_list: import("@prisma/client/runtime/client").JsonValue | null;
        google_id: string | null;
        is_email_verified: boolean;
        disliked_foods: import("@prisma/client/runtime/client").JsonValue | null;
        food_allergies: import("@prisma/client/runtime/client").JsonValue | null;
    } & {
        is_profile_complete: boolean;
    })[]>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    getUser(id: string, request: AuthenticatedRequest): Promise<({
        user_id: string;
        username: string;
        email: string;
        full_name: string;
        phone: string | null;
        age: number | null;
        gender: string | null;
        height: number | null;
        weight: number | null;
        bmi: import("@prisma/client-runtime-utils").Decimal;
        birthday: Date | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        budget_daily: import("@prisma/client-runtime-utils").Decimal;
        budget_weekly: import("@prisma/client-runtime-utils").Decimal;
        budget_monthly: import("@prisma/client-runtime-utils").Decimal;
        calories_per_day: number;
        daily_target_calories: number;
        activity_level: import("@prisma/client").$Enums.users_activity_level;
        liked_foods: import("@prisma/client/runtime/client").JsonValue | null;
        preferred_food_types: import("@prisma/client/runtime/client").JsonValue | null;
        health_goals_list: import("@prisma/client/runtime/client").JsonValue | null;
        google_id: string | null;
        is_email_verified: boolean;
        disliked_foods: import("@prisma/client/runtime/client").JsonValue | null;
        food_allergies: import("@prisma/client/runtime/client").JsonValue | null;
    } & {
        is_profile_complete: boolean;
    }) | null>;
    updateUser(id: string, request: AuthenticatedRequest, dto: UpdateUserDto): Promise<{
        user_id: string;
        username: string;
        email: string;
        full_name: string;
        phone: string | null;
        age: number | null;
        gender: string | null;
        height: number | null;
        weight: number | null;
        bmi: import("@prisma/client-runtime-utils").Decimal;
        birthday: Date | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        budget_daily: import("@prisma/client-runtime-utils").Decimal;
        budget_weekly: import("@prisma/client-runtime-utils").Decimal;
        budget_monthly: import("@prisma/client-runtime-utils").Decimal;
        calories_per_day: number;
        daily_target_calories: number;
        activity_level: import("@prisma/client").$Enums.users_activity_level;
        liked_foods: import("@prisma/client/runtime/client").JsonValue | null;
        preferred_food_types: import("@prisma/client/runtime/client").JsonValue | null;
        health_goals_list: import("@prisma/client/runtime/client").JsonValue | null;
        google_id: string | null;
        is_email_verified: boolean;
        disliked_foods: import("@prisma/client/runtime/client").JsonValue | null;
        food_allergies: import("@prisma/client/runtime/client").JsonValue | null;
    } & {
        is_profile_complete: boolean;
    }>;
}
