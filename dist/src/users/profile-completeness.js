"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withProfileCompleteness = exports.isProfileComplete = void 0;
const isPositiveNumber = (value) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) && numericValue > 0;
};
const isProfileComplete = (user) => isPositiveNumber(user.age) &&
    isPositiveNumber(user.height) &&
    isPositiveNumber(user.weight) &&
    isPositiveNumber(user.budget_daily) &&
    isPositiveNumber(user.daily_target_calories);
exports.isProfileComplete = isProfileComplete;
const withProfileCompleteness = (user) => ({
    ...user,
    is_profile_complete: (0, exports.isProfileComplete)(user),
});
exports.withProfileCompleteness = withProfileCompleteness;
//# sourceMappingURL=profile-completeness.js.map