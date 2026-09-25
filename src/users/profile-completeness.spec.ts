import {
  isProfileComplete,
  type ProfileCompletenessFields,
} from './profile-completeness';

describe('isProfileComplete', () => {
  const completeProfile: ProfileCompletenessFields = {
    age: 30,
    height: 175,
    weight: 70,
    budget_daily: 200,
    daily_target_calories: 2000,
  };

  it('returns true when every required profile value is positive', () => {
    expect(isProfileComplete(completeProfile)).toBe(true);
  });

  it.each(Object.keys(completeProfile) as (keyof ProfileCompletenessFields)[])(
    'returns false when %s is missing or not positive',
    (field) => {
      expect(isProfileComplete({ ...completeProfile, [field]: null })).toBe(
        false,
      );
      expect(isProfileComplete({ ...completeProfile, [field]: 0 })).toBe(false);
      expect(isProfileComplete({ ...completeProfile, [field]: -1 })).toBe(
        false,
      );
    },
  );

  it('does not require optional profile preferences', () => {
    const profileWithEmptyOptionalValues = {
      ...completeProfile,
      gender: '',
      phone: null,
      birthday: null,
      liked_foods: null,
      disliked_foods: null,
      food_allergies: null,
      health_goals_list: null,
    };

    expect(isProfileComplete(profileWithEmptyOptionalValues)).toBe(true);
  });
});
