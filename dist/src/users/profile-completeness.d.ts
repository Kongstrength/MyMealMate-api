export type ProfileCompletenessFields = {
    age: unknown;
    height: unknown;
    weight: unknown;
    budget_daily: unknown;
    daily_target_calories: unknown;
};
export declare const isProfileComplete: (user: ProfileCompletenessFields) => boolean;
export declare const withProfileCompleteness: <T extends ProfileCompletenessFields>(user: T) => T & {
    is_profile_complete: boolean;
};
