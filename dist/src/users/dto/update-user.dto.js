"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserDto = void 0;
const class_validator_1 = require("class-validator");
class UpdateUserDto {
    full_name;
    phone;
    age;
    gender;
    height;
    weight;
    bmi;
    birthday;
    activity_level;
    budget_daily;
    budget_weekly;
    budget_monthly;
    calories_per_day;
    daily_target_calories;
    liked_foods;
    disliked_foods;
    food_allergies;
    preferred_food_types;
    health_goals_list;
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "full_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'อายุต้องเป็นจำนวนเต็ม' }),
    (0, class_validator_1.Min)(1, { message: 'อายุต้องอยู่ระหว่าง 1–120 ปี' }),
    (0, class_validator_1.Max)(120, { message: 'อายุต้องอยู่ระหว่าง 1–120 ปี' }),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "age", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'ส่วนสูงต้องเป็นตัวเลข' }),
    (0, class_validator_1.Min)(50, { message: 'ส่วนสูงต้องอยู่ระหว่าง 50–250 ซม.' }),
    (0, class_validator_1.Max)(250, { message: 'ส่วนสูงต้องอยู่ระหว่าง 50–250 ซม.' }),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "height", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'น้ำหนักต้องเป็นตัวเลข' }),
    (0, class_validator_1.Min)(10, { message: 'น้ำหนักต้องอยู่ระหว่าง 10–400 กก.' }),
    (0, class_validator_1.Max)(400, { message: 'น้ำหนักต้องอยู่ระหว่าง 10–400 กก.' }),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "weight", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "bmi", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "birthday", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['SEDENTARY', 'LIGHT_1_3', 'MODERATE_3_5', 'ACTIVE_6_7', 'VERY_ACTIVE']),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "activity_level", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'งบรายวันต้องเป็นตัวเลข' }),
    (0, class_validator_1.Min)(0, { message: 'งบรายวันต้องอยู่ระหว่าง 0–1,000,000 บาท' }),
    (0, class_validator_1.Max)(1000000, { message: 'งบรายวันต้องอยู่ระหว่าง 0–1,000,000 บาท' }),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "budget_daily", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'งบรายสัปดาห์ต้องเป็นตัวเลข' }),
    (0, class_validator_1.Min)(0, { message: 'งบรายสัปดาห์ต้องอยู่ระหว่าง 0–7,000,000 บาท' }),
    (0, class_validator_1.Max)(7000000, { message: 'งบรายสัปดาห์ต้องอยู่ระหว่าง 0–7,000,000 บาท' }),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "budget_weekly", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'งบรายเดือนต้องเป็นตัวเลข' }),
    (0, class_validator_1.Min)(0, { message: 'งบรายเดือนต้องอยู่ระหว่าง 0–30,000,000 บาท' }),
    (0, class_validator_1.Max)(30000000, { message: 'งบรายเดือนต้องอยู่ระหว่าง 0–30,000,000 บาท' }),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "budget_monthly", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10000),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "calories_per_day", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'แคลอรีเป้าหมายต้องเป็นจำนวนเต็ม' }),
    (0, class_validator_1.Min)(500, { message: 'แคลอรีเป้าหมายต้องอยู่ระหว่าง 500–10,000 kcal' }),
    (0, class_validator_1.Max)(10000, { message: 'แคลอรีเป้าหมายต้องอยู่ระหว่าง 500–10,000 kcal' }),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "daily_target_calories", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Object)
], UpdateUserDto.prototype, "liked_foods", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Object)
], UpdateUserDto.prototype, "disliked_foods", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Object)
], UpdateUserDto.prototype, "food_allergies", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Object)
], UpdateUserDto.prototype, "preferred_food_types", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Object)
], UpdateUserDto.prototype, "health_goals_list", void 0);
//# sourceMappingURL=update-user.dto.js.map