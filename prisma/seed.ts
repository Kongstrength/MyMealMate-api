import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
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
    cooking_tips: 'ใช้ไฟอ่อนและคนเป็นระยะเพื่อให้โจ๊กเนียน',
    ingredients: [
      { name: 'ข้าวสวย', amount: '1 ถ้วย', estimated_price: 8 },
      { name: 'หมูสับ', amount: '100 กรัม', estimated_price: 22 },
      { name: 'ไข่ไก่', amount: '1 ฟอง', estimated_price: 6 },
      { name: 'ต้นหอม', amount: '1 ต้น', estimated_price: 2 },
    ],
    steps: ['ต้มข้าวกับน้ำจนเมล็ดข้าวนุ่ม', 'ใส่หมูสับและปรุงจนสุก', 'ตอกไข่และโรยต้นหอมก่อนเสิร์ฟ'],
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
    cooking_tips: 'ผัดใบกะเพราช่วงท้ายเพื่อรักษากลิ่นหอม',
    ingredients: [
      { name: 'ข้าวสวย', amount: '1 จาน', estimated_price: 10 },
      { name: 'เนื้อไก่', amount: '120 กรัม', estimated_price: 28 },
      { name: 'ใบกะเพรา', amount: '20 กรัม', estimated_price: 5 },
      { name: 'น้ำปลา', amount: '1 ช้อนชา', estimated_price: 1 },
    ],
    steps: ['ผัดพริกและกระเทียมให้หอม', 'ใส่เนื้อไก่และปรุงรสจนสุก', 'ใส่ใบกะเพราแล้วเสิร์ฟกับข้าว'],
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
    cooking_tips: 'พักอกไก่หลังย่างก่อนหั่นเพื่อให้เนื้อยังชุ่มฉ่ำ',
    ingredients: [
      { name: 'อกไก่', amount: '120 กรัม', estimated_price: 32 },
      { name: 'อะโวคาโด', amount: 'ครึ่งผล', estimated_price: 25 },
      { name: 'ผักสลัด', amount: '100 กรัม', estimated_price: 12 },
      { name: 'น้ำสลัด', amount: '1 ช้อนโต๊ะ', estimated_price: 3 },
    ],
    steps: ['ย่างอกไก่จนสุกแล้วหั่นชิ้น', 'ล้างและจัดผักสลัดกับอะโวคาโด', 'วางไก่และราดน้ำสลัด'],
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
    cooking_tips: 'ใช้ข้าวที่เย็นแล้วเพื่อให้ข้าวผัดร่วน',
    ingredients: [
      { name: 'ข้าวสวย', amount: '1 จาน', estimated_price: 10 },
      { name: 'แครอท', amount: '30 กรัม', estimated_price: 4 },
      { name: 'ข้าวโพดอ่อน', amount: '30 กรัม', estimated_price: 5 },
      { name: 'ไข่ไก่', amount: '1 ฟอง', estimated_price: 6 },
    ],
    steps: ['ผัดไข่ให้พอสุก', 'ใส่ผักรวมและผัดจนสุก', 'ใส่ข้าวและปรุงรสให้เข้ากัน'],
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
    cooking_tips: 'ช้อนฟองออกระหว่างต้มเพื่อให้น้ำซุปใส',
    ingredients: [
      { name: 'เต้าหู้ไข่', amount: '1 หลอด', estimated_price: 12 },
      { name: 'หมูสับ', amount: '100 กรัม', estimated_price: 22 },
      { name: 'ผักกาดขาว', amount: '100 กรัม', estimated_price: 8 },
      { name: 'ต้นหอม', amount: '1 ต้น', estimated_price: 2 },
    ],
    steps: ['ต้มน้ำซุปจนเดือด', 'ใส่หมูสับและผักกาดขาว', 'ใส่เต้าหู้ ต้มจนสุก แล้วโรยต้นหอม'],
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
    cooking_tips: 'เลือกโยเกิร์ตรสธรรมชาติเพื่อลดน้ำตาล',
    ingredients: [
      { name: 'โยเกิร์ต', amount: '1 ถ้วย', estimated_price: 20 },
      { name: 'กล้วย', amount: 'ครึ่งผล', estimated_price: 4 },
      { name: 'สตรอว์เบอร์รี', amount: '3 ผล', estimated_price: 9 },
    ],
    steps: ['หั่นผลไม้เป็นชิ้นพอดีคำ', 'ใส่โยเกิร์ตลงถ้วย', 'วางผลไม้ด้านบนและเสิร์ฟทันที'],
  },
];

async function main() {
  for (const recipe of recipes) {
    const { ingredients, steps, ...recipeData } = recipe;
    const ingredientRows = ingredients.map((ingredient, index) => ({
      ...ingredient,
      sort_order: index,
    }));
    const stepRows = steps.map((instruction, index) => ({
      instruction,
      sort_order: index,
    }));
    const existing = await prisma.recipe.findFirst({
      where: { name: recipe.name },
    });

    if (existing) {
      await prisma.recipe.update({
        where: { recipe_id: existing.recipe_id },
        data: {
          ...recipeData,
          source: 'CURATED',
          ingredients: { deleteMany: {}, create: ingredientRows },
          steps: { deleteMany: {}, create: stepRows },
        },
      });
    } else {
      await prisma.recipe.create({
        data: {
          ...recipeData,
          source: 'CURATED',
          ingredients: { create: ingredientRows },
          steps: { create: stepRows },
        },
      });
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
