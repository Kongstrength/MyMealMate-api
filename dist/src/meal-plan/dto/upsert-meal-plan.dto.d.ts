declare const mealTypes: readonly ["BREAKFAST", "LUNCH", "DINNER"];
export declare class MealPlanItemDto {
    recipe_id: string;
    meal_type: (typeof mealTypes)[number];
    servings?: number;
}
export declare class UpsertMealPlanDto {
    items: MealPlanItemDto[];
}
export {};
