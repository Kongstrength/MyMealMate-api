CREATE TYPE "recipe_source" AS ENUM ('CURATED', 'AI');

ALTER TABLE "recipe"
ADD COLUMN "source" "recipe_source" NOT NULL DEFAULT 'CURATED',
ADD COLUMN "cooking_tips" TEXT;

CREATE TABLE "recipeIngredient" (
    "recipe_ingredient_id" UUID NOT NULL,
    "recipe_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "amount" TEXT,
    "estimated_price" DECIMAL(10,2),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "recipeIngredient_pkey" PRIMARY KEY ("recipe_ingredient_id")
);

CREATE TABLE "recipeStep" (
    "recipe_step_id" UUID NOT NULL,
    "recipe_id" UUID NOT NULL,
    "instruction" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "recipeStep_pkey" PRIMARY KEY ("recipe_step_id")
);

CREATE INDEX "recipeIngredient_recipe_id_sort_order_idx" ON "recipeIngredient"("recipe_id", "sort_order");
CREATE INDEX "recipeIngredient_name_idx" ON "recipeIngredient"("name");
CREATE INDEX "recipeStep_recipe_id_sort_order_idx" ON "recipeStep"("recipe_id", "sort_order");

ALTER TABLE "recipeIngredient" ADD CONSTRAINT "recipeIngredient_recipe_id_fkey"
FOREIGN KEY ("recipe_id") REFERENCES "recipe"("recipe_id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "recipeStep" ADD CONSTRAINT "recipeStep_recipe_id_fkey"
FOREIGN KEY ("recipe_id") REFERENCES "recipe"("recipe_id") ON DELETE CASCADE ON UPDATE CASCADE;
