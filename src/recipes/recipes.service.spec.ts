import { RecipesService } from './recipes.service';

describe('RecipesService', () => {
  it('returns structured ingredients, steps and recipe source', async () => {
    const prisma = {
      recipe: {
        findMany: jest.fn().mockResolvedValue([
          {
            recipe_id: 'recipe-1',
            name: 'ข้าวกะเพราไก่',
            description: 'เมนูทดสอบ',
            meal_type: 'LUNCH',
            calories: 520,
            protein_g: 31,
            carbs_g: 62,
            fat_g: 16,
            estimated_cost: 55,
            emoji: '🍛',
            source: 'AI',
            cooking_tips: 'ใส่ใบกะเพราช่วงท้าย',
            ingredients: [
              {
                name: 'เนื้อไก่',
                amount: '120 กรัม',
                estimated_price: 28,
              },
            ],
            steps: [{ instruction: 'ผัดไก่จนสุก' }],
          },
        ]),
      },
    };
    const service = new RecipesService(prisma as never);

    const result = await service.findActive('lunch');

    expect(prisma.recipe.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { is_active: true, meal_type: 'LUNCH' },
        include: {
          ingredients: { orderBy: { sort_order: 'asc' } },
          steps: { orderBy: { sort_order: 'asc' } },
        },
      }),
    );
    expect(result[0]).toEqual(
      expect.objectContaining({
        source: 'AI',
        ingredients: [
          { name: 'เนื้อไก่', amount: '120 กรัม', estimatedPrice: 28 },
        ],
        steps: ['ผัดไก่จนสุก'],
      }),
    );
  });
});
