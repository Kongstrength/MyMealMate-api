import { PrismaService } from '../prisma/prisma.service';
export declare class RecipesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    }[]>;
}
