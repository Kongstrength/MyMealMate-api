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
exports.UpsertMealPlanDto = exports.MealPlanItemDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER'];
class MealPlanItemDto {
    recipe_id;
    meal_type;
    servings;
}
exports.MealPlanItemDto = MealPlanItemDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], MealPlanItemDto.prototype, "recipe_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(mealTypes),
    __metadata("design:type", Object)
], MealPlanItemDto.prototype, "meal_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], MealPlanItemDto.prototype, "servings", void 0);
class UpsertMealPlanDto {
    items;
}
exports.UpsertMealPlanDto = UpsertMealPlanDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => MealPlanItemDto),
    __metadata("design:type", Array)
], UpsertMealPlanDto.prototype, "items", void 0);
//# sourceMappingURL=upsert-meal-plan.dto.js.map