import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

const mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'] as const;

export class SaveMealIngredientDto {
  @IsString()
  @MaxLength(120)
  name!: string;

  @IsString()
  @MaxLength(80)
  amount!: string;

  @IsNumber()
  @Min(0)
  estimated_price!: number;
}

export class SaveMealItemDto {
  @IsString()
  @IsIn(mealTypes)
  meal_type!: (typeof mealTypes)[number];

  @IsString()
  menu_name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SaveMealIngredientDto)
  ingredients!: SaveMealIngredientDto[];

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  steps!: string[];

  @IsOptional()
  @IsString()
  @MaxLength(500)
  cooking_tips?: string;

  @IsNumber()
  @Min(0)
  estimated_cost!: number;

  @IsNumber()
  @Min(0)
  calories!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  protein_g?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  carbs_g?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  fat_g?: number;
}

export class SaveMealPlanDto {
  @IsOptional()
  @IsString()
  date?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @ValidateNested({ each: true })
  @Type(() => SaveMealItemDto)
  meals!: SaveMealItemDto[];
}
