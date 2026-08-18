-- CreateEnum
CREATE TYPE "users_activity_level" AS ENUM ('SEDENTARY', 'LIGHT_1_3', 'MODERATE_3_5', 'ACTIVE_6_7', 'VERY_ACTIVE');

-- CreateTable
CREATE TABLE "user" (
    "user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "full_name" TEXT NOT NULL,
    "phone" TEXT,
    "age" INTEGER,
    "gender" TEXT,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "bmi" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "birthday" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "budget_daily" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "budget_weekly" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "budget_monthly" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "calories_per_day" INTEGER NOT NULL DEFAULT 0,
    "daily_target_calories" INTEGER NOT NULL DEFAULT 0,
    "activity_level" "users_activity_level" NOT NULL,
    "liked_foods" JSONB,
    "preferred_food_types" JSONB,
    "health_goals_list" JSONB,
    "google_id" TEXT,
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_google_id_key" ON "user"("google_id");
