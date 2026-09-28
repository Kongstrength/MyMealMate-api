import { RecipesService } from './recipes.service';
export declare class RecipesController {
    private readonly recipesService;
    constructor(recipesService: RecipesService);
    findActive(mealType?: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        mealType: string;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        estimatedCost: number;
        emoji: string | null;
        source: import("@prisma/client").$Enums.recipe_source;
        cookingTips: string | null;
        ingredients: {
            name: string;
            amount: string | null;
            estimatedPrice: number | null;
        }[];
        steps: string[];
    }[]>;
}
