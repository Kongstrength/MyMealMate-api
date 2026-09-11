"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("@prisma/client");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
}
const prisma = new client_1.PrismaClient({
    adapter: new adapter_pg_1.PrismaPg({ connectionString }),
});
const recipes = [
    {
        name: 'โจ๊กหมูใส่ไข่',
        description: 'โจ๊กหมูพร้อมไข่สำหรับมื้อเช้า',
        meal_type: 'BREAKFAST',
        calories: 385,
        protein_g: 22,
        carbs_g: 45,
        fat_g: 12,
        estimated_cost: 45,
        emoji: '🍲',
    },
    {
        name: 'ข้าวกะเพราไก่',
        description: 'ข้าวกะเพราไก่แบบง่ายและอิ่มท้อง',
        meal_type: 'LUNCH',
        calories: 520,
        protein_g: 31,
        carbs_g: 62,
        fat_g: 16,
        estimated_cost: 55,
        emoji: '🍛',
    },
    {
        name: 'สลัดอกไก่อะโวคาโด',
        description: 'สลัดผักสดกับอกไก่และอะโวคาโด',
        meal_type: 'DINNER',
        calories: 420,
        protein_g: 35,
        carbs_g: 22,
        fat_g: 21,
        estimated_cost: 72,
        emoji: '🥗',
    },
    {
        name: 'ข้าวผัดผักรวม',
        description: 'ข้าวผัดผักรวมสำหรับมื้อกลางวัน',
        meal_type: 'LUNCH',
        calories: 460,
        protein_g: 14,
        carbs_g: 68,
        fat_g: 14,
        estimated_cost: 40,
        emoji: '🍚',
    },
    {
        name: 'ต้มจืดเต้าหู้หมูสับ',
        description: 'ต้มจืดรสอ่อนพร้อมเต้าหู้และหมูสับ',
        meal_type: 'DINNER',
        calories: 280,
        protein_g: 24,
        carbs_g: 12,
        fat_g: 14,
        estimated_cost: 50,
        emoji: '🍲',
    },
    {
        name: 'โยเกิร์ตผลไม้',
        description: 'โยเกิร์ตกับผลไม้สดสำหรับมื้อเช้า',
        meal_type: 'BREAKFAST',
        calories: 250,
        protein_g: 12,
        carbs_g: 34,
        fat_g: 7,
        estimated_cost: 35,
        emoji: '🥣',
    },
];
async function main() {
    for (const recipe of recipes) {
        const existing = await prisma.recipe.findFirst({
            where: { name: recipe.name },
        });
        if (existing) {
            await prisma.recipe.update({
                where: { recipe_id: existing.recipe_id },
                data: recipe,
            });
        }
        else {
            await prisma.recipe.create({ data: recipe });
        }
    }
    console.log(`Seeded ${recipes.length} recipes`);
}
main()
    .catch((error) => {
    console.error(error);
    process.exitCode = 1;
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map