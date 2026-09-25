-- The AI meal-plan save flow upserts recipes by name and meal type.
-- This index is required by the corresponding Prisma compound unique key.
CREATE UNIQUE INDEX "recipe_name_meal_type_key" ON "recipe"("name", "meal_type");
