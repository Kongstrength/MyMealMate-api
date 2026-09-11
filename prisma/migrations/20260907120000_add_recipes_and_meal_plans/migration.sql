-- CreateTable
CREATE TABLE "recipe" (
    "recipe_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "meal_type" TEXT NOT NULL,
    "calories" INTEGER NOT NULL,
    "protein_g" DECIMAL(10,2) NOT NULL,
    "carbs_g" DECIMAL(10,2) NOT NULL,
    "fat_g" DECIMAL(10,2) NOT NULL,
    "estimated_cost" DECIMAL(10,2) NOT NULL,
    "emoji" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "recipe_pkey" PRIMARY KEY ("recipe_id")
);

-- CreateTable
CREATE TABLE "mealPlan" (
    "meal_plan_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "plan_date" DATE NOT NULL,
    "total_calories" INTEGER NOT NULL DEFAULT 0,
    "total_cost" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "mealPlan_pkey" PRIMARY KEY ("meal_plan_id")
);

-- CreateTable
CREATE TABLE "mealPlanItem" (
    "meal_plan_item_id" UUID NOT NULL,
    "meal_plan_id" UUID NOT NULL,
    "recipe_id" UUID NOT NULL,
    "meal_type" TEXT NOT NULL,
    "servings" DECIMAL(5,2) NOT NULL DEFAULT 1,
    "calories_snapshot" INTEGER NOT NULL,
    "cost_snapshot" DECIMAL(10,2) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "mealPlanItem_pkey" PRIMARY KEY ("meal_plan_item_id")
);

-- CreateIndex
CREATE INDEX "recipe_meal_type_idx" ON "recipe"("meal_type");
CREATE INDEX "recipe_is_active_idx" ON "recipe"("is_active");
CREATE INDEX "mealPlan_plan_date_idx" ON "mealPlan"("plan_date");
CREATE UNIQUE INDEX "mealPlan_user_id_plan_date_key" ON "mealPlan"("user_id", "plan_date");
CREATE INDEX "mealPlanItem_recipe_id_idx" ON "mealPlanItem"("recipe_id");
CREATE UNIQUE INDEX "mealPlanItem_meal_plan_id_meal_type_key" ON "mealPlanItem"("meal_plan_id", "meal_type");

-- AddForeignKey
ALTER TABLE "mealPlan" ADD CONSTRAINT "mealPlan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "mealPlanItem" ADD CONSTRAINT "mealPlanItem_meal_plan_id_fkey" FOREIGN KEY ("meal_plan_id") REFERENCES "mealPlan"("meal_plan_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "mealPlanItem" ADD CONSTRAINT "mealPlanItem_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("recipe_id") ON DELETE RESTRICT ON UPDATE CASCADE;
