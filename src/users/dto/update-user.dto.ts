import {
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  full_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsInt({ message: 'อายุต้องเป็นจำนวนเต็ม' })
  @Min(1, { message: 'อายุต้องอยู่ระหว่าง 1–120 ปี' })
  @Max(120, { message: 'อายุต้องอยู่ระหว่าง 1–120 ปี' })
  age?: number;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsNumber({}, { message: 'ส่วนสูงต้องเป็นตัวเลข' })
  @Min(50, { message: 'ส่วนสูงต้องอยู่ระหว่าง 50–250 ซม.' })
  @Max(250, { message: 'ส่วนสูงต้องอยู่ระหว่าง 50–250 ซม.' })
  height?: number;

  @IsOptional()
  @IsNumber({}, { message: 'น้ำหนักต้องเป็นตัวเลข' })
  @Min(10, { message: 'น้ำหนักต้องอยู่ระหว่าง 10–400 กก.' })
  @Max(400, { message: 'น้ำหนักต้องอยู่ระหว่าง 10–400 กก.' })
  weight?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  bmi?: number;

  @IsOptional()
  @IsDateString()
  birthday?: string;

  @IsOptional()
  @IsIn(['SEDENTARY', 'LIGHT_1_3', 'MODERATE_3_5', 'ACTIVE_6_7', 'VERY_ACTIVE'])
  activity_level?:
    'SEDENTARY' | 'LIGHT_1_3' | 'MODERATE_3_5' | 'ACTIVE_6_7' | 'VERY_ACTIVE';

  @IsOptional()
  @IsNumber({}, { message: 'งบรายวันต้องเป็นตัวเลข' })
  @Min(0, { message: 'งบรายวันต้องอยู่ระหว่าง 0–1,000,000 บาท' })
  @Max(1000000, { message: 'งบรายวันต้องอยู่ระหว่าง 0–1,000,000 บาท' })
  budget_daily?: number;

  @IsOptional()
  @IsNumber({}, { message: 'งบรายสัปดาห์ต้องเป็นตัวเลข' })
  @Min(0, { message: 'งบรายสัปดาห์ต้องอยู่ระหว่าง 0–7,000,000 บาท' })
  @Max(7000000, { message: 'งบรายสัปดาห์ต้องอยู่ระหว่าง 0–7,000,000 บาท' })
  budget_weekly?: number;

  @IsOptional()
  @IsNumber({}, { message: 'งบรายเดือนต้องเป็นตัวเลข' })
  @Min(0, { message: 'งบรายเดือนต้องอยู่ระหว่าง 0–30,000,000 บาท' })
  @Max(30000000, { message: 'งบรายเดือนต้องอยู่ระหว่าง 0–30,000,000 บาท' })
  budget_monthly?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10000)
  calories_per_day?: number;

  @IsOptional()
  @IsInt({ message: 'แคลอรีเป้าหมายต้องเป็นจำนวนเต็ม' })
  @Min(500, { message: 'แคลอรีเป้าหมายต้องอยู่ระหว่าง 500–10,000 kcal' })
  @Max(10000, { message: 'แคลอรีเป้าหมายต้องอยู่ระหว่าง 500–10,000 kcal' })
  daily_target_calories?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  liked_foods?: string[] | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  disliked_foods?: string[] | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  food_allergies?: string[] | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferred_food_types?: string[] | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  health_goals_list?: string[] | null;
}
