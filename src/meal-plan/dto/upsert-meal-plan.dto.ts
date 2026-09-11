import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

const mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER'] as const;

export class MealPlanItemDto {
  @IsUUID()
  recipe_id!: string;

  @IsString()
  @IsIn(mealTypes)
  meal_type!: (typeof mealTypes)[number];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  servings?: number;
}

export class UpsertMealPlanDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MealPlanItemDto)
  items!: MealPlanItemDto[];
}
