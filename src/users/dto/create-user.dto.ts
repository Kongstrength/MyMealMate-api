import {
  IsArray,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  PASSWORD_PATTERN,
  PASSWORD_REQUIREMENTS_MESSAGE,
} from './password-policy';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: PASSWORD_REQUIREMENTS_MESSAGE })
  @MaxLength(64, { message: PASSWORD_REQUIREMENTS_MESSAGE })
  @Matches(PASSWORD_PATTERN, { message: PASSWORD_REQUIREMENTS_MESSAGE })
  password!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  full_name?: string;
  phone?: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  bmi?: number;
  @IsDateString({}, { message: 'กรุณากรอกวันเกิดให้ถูกต้อง' })
  @IsNotEmpty({ message: 'กรุณากรอกวันเกิด' })
  birthday!: string;

  activity_level?:
    'SEDENTARY' | 'LIGHT_1_3' | 'MODERATE_3_5' | 'ACTIVE_6_7' | 'VERY_ACTIVE';
  budget_daily?: number;
  budget_weekly?: number;
  budget_monthly?: number;
  calories_per_day?: number;
  daily_target_calories?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  liked_foods?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  disliked_foods?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  food_allergies?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferred_food_types?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  health_goals_list?: string[];
}
