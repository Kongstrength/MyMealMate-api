import { validate } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';

describe('UpdateUserDto', () => {
  it('accepts valid profile values', async () => {
    const dto = Object.assign(new UpdateUserDto(), {
      full_name: 'สมชาย ใจดี',
      age: 35,
      height: 175,
      weight: 70,
      birthday: '1991-01-15T00:00:00.000Z',
      activity_level: 'LIGHT_1_3',
      budget_daily: 200,
      budget_weekly: 1400,
      budget_monthly: 6000,
      daily_target_calories: 2000,
    });

    await expect(validate(dto)).resolves.toHaveLength(0);
  });

  it.each([
    ['age', 0, 'อายุต้องอยู่ระหว่าง 1–120 ปี'],
    ['height', 20, 'ส่วนสูงต้องอยู่ระหว่าง 50–250 ซม.'],
    ['weight', 5, 'น้ำหนักต้องอยู่ระหว่าง 10–400 กก.'],
    ['budget_daily', -1, 'งบรายวันต้องอยู่ระหว่าง 0–1,000,000 บาท'],
    [
      'daily_target_calories',
      100,
      'แคลอรีเป้าหมายต้องอยู่ระหว่าง 500–10,000 kcal',
    ],
    ['activity_level', 'UNKNOWN', undefined],
  ])('rejects invalid %s', async (field, value, expectedMessage) => {
    const dto = Object.assign(new UpdateUserDto(), { [field]: value });
    const errors = await validate(dto);

    const fieldError = errors.find((error) => error.property === field);
    expect(fieldError).toBeDefined();
    if (expectedMessage) {
      expect(Object.values(fieldError?.constraints ?? {})).toContain(
        expectedMessage,
      );
    }
  });
});
