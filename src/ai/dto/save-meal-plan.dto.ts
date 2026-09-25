import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

const mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'] as const;

export class SaveMealItemDto {
  @IsString()
  @IsIn(mealTypes)
  meal_type!: (typeof mealTypes)[number];

  @IsString()
  menu_name!: string;

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
