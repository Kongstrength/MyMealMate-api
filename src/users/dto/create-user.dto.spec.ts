import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { PASSWORD_REQUIREMENTS_MESSAGE } from './password-policy';

function createDto(password: string, birthday = '1995-05-15T00:00:00.000Z') {
  return Object.assign(new CreateUserDto(), {
    username: 'new-user',
    email: 'new-user@example.com',
    password,
    full_name: 'ผู้ใช้ใหม่',
    birthday,
  });
}

describe('CreateUserDto', () => {
  it('accepts a strong password and valid birthday', async () => {
    await expect(validate(createDto('StrongPass1!'))).resolves.toHaveLength(0);
  });

  it.each([
    'short1!',
    'lowercase1!',
    'UPPERCASE1!',
    'NoNumbers!',
    'NoSpecial1',
  ])('rejects weak password %s', async (password) => {
    const errors = await validate(createDto(password));
    const passwordError = errors.find((error) => error.property === 'password');

    expect(passwordError).toBeDefined();
    expect(Object.values(passwordError?.constraints ?? {})).toContain(
      PASSWORD_REQUIREMENTS_MESSAGE,
    );
  });

  it('rejects an invalid birthday', async () => {
    const errors = await validate(createDto('StrongPass1!', 'not-a-date'));
    const birthdayError = errors.find((error) => error.property === 'birthday');

    expect(birthdayError).toBeDefined();
    expect(Object.values(birthdayError?.constraints ?? {})).toContain(
      'กรุณากรอกวันเกิดให้ถูกต้อง',
    );
  });
});
