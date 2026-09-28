declare const mealTypes: readonly ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];
export declare class SaveMealIngredientDto {
    name: string;
    amount: string;
    estimated_price: number;
}
export declare class SaveMealItemDto {
    meal_type: (typeof mealTypes)[number];
    menu_name: string;
    description?: string;
    ingredients: SaveMealIngredientDto[];
    steps: string[];
    cooking_tips?: string;
    estimated_cost: number;
    calories: number;
    protein_g?: number;
    carbs_g?: number;
    fat_g?: number;
}
export declare class SaveMealPlanDto {
    date?: string;
    meals: SaveMealItemDto[];
}
export {};
