export type ProfileCompletenessFields = {
  age: unknown;
  height: unknown;
  weight: unknown;
  budget_daily: unknown;
  daily_target_calories: unknown;
};

const isPositiveNumber = (value: unknown): boolean => {
  const numericValue = Number(value);

  return Number.isFinite(numericValue) && numericValue > 0;
};

export const isProfileComplete = (user: ProfileCompletenessFields): boolean =>
  isPositiveNumber(user.age) &&
  isPositiveNumber(user.height) &&
  isPositiveNumber(user.weight) &&
  isPositiveNumber(user.budget_daily) &&
  isPositiveNumber(user.daily_target_calories);

export const withProfileCompleteness = <T extends ProfileCompletenessFields>(
  user: T,
): T & { is_profile_complete: boolean } => ({
  ...user,
  is_profile_complete: isProfileComplete(user),
});
