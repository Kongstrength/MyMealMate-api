import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class RecommendMenuDto {
  @IsOptional()
  @IsNumber()
  @Min(50)
  @Max(10000)
  budget?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(4)
  meals_count?: number;

  @IsOptional()
  @IsString()
  preferences?: string;
}
