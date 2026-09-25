import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailService } from '../mail/mail.service';
import { createHash, randomBytes } from 'crypto';
import { Prisma } from '@prisma/client';
import { withProfileCompleteness } from './profile-completeness';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: CreateUserDto) {
    if (!dto.username || !dto.email || !dto.password) {
      throw new BadRequestException(
        'Username, email, and password are required',
      );
    }

    const birthday = new Date(dto.birthday);
    const today = new Date();
    if (birthday > today) {
      throw new BadRequestException('วันเกิดต้องไม่เป็นวันที่ในอนาคต');
    }
    let age = today.getUTCFullYear() - birthday.getUTCFullYear();
    const birthdayPassedThisYear =
      today.getUTCMonth() > birthday.getUTCMonth() ||
      (today.getUTCMonth() === birthday.getUTCMonth() &&
        today.getUTCDate() >= birthday.getUTCDate());
    if (!birthdayPassedThisYear) age -= 1;
    if (age > 120) {
      throw new BadRequestException('วันเกิดต้องมีอายุไม่เกิน 120 ปี');
    }

    const exists = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { username: dto.username }],
      },
    });

    if (exists) {
      throw new BadRequestException('Email or username already exists');
    }

    const password_hash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password_hash,
        full_name: dto.full_name ?? dto.username,
        phone: dto.phone ?? null,
        age: dto.age ?? age,
        gender: dto.gender ?? null,
        height: dto.height ?? null,
        weight: dto.weight ?? null,
        bmi: dto.bmi ?? 0,
        birthday,
        activity_level: dto.activity_level ?? 'SEDENTARY',
        budget_daily: dto.budget_daily ?? 0,
        budget_weekly: dto.budget_weekly ?? 0,
        budget_monthly: dto.budget_monthly ?? 0,
        calories_per_day: dto.calories_per_day ?? 0,
        daily_target_calories: dto.daily_target_calories ?? 0,
        liked_foods: dto.liked_foods ?? Prisma.DbNull,
        disliked_foods: dto.disliked_foods ?? Prisma.DbNull,
        food_allergies: dto.food_allergies ?? Prisma.DbNull,
        preferred_food_types: dto.preferred_food_types ?? Prisma.DbNull,
        health_goals_list: dto.health_goals_list ?? Prisma.DbNull,
      },
    });

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawToken);

    await this.prisma.emailVerificationToken.create({
      data: {
        token_hash: tokenHash,
        user_id: user.user_id,
        expires_at: new Date(Date.now() + 30 * 60 * 1000),
      },
    });

    await this.mailService.sendVerificationEmail(user.email, rawToken);

    return {
      message:
        'Registration successful. Please check your email to verify your account.',
    };
  }

  async verifyEmail(token: string) {
    if (!token?.trim()) {
      throw new BadRequestException('Verification token is required');
    }

    const tokenHash = this.hashToken(token.trim());

    const verificationToken =
      await this.prisma.emailVerificationToken.findUnique({
        where: { token_hash: tokenHash },
      });

    if (
      !verificationToken ||
      verificationToken.used_at ||
      verificationToken.expires_at < new Date()
    ) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { user_id: verificationToken.user_id },
        data: { is_email_verified: true },
      }),
      this.prisma.emailVerificationToken.update({
        where: { id: verificationToken.id },
        data: { used_at: new Date() },
      }),
    ]);

    return {
      message: 'Email verified successfully',
    };
  }

  async login(dto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!dto.email || !dto.password) {
      throw new BadRequestException('Email and password are required');
    }
    if (!user || !user.password_hash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.is_email_verified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    const token = this.signToken(user.user_id, user.email);

    const { password_hash, ...safeUser } = user;
    void password_hash;
    return {
      user: withProfileCompleteness(safeUser),
      accessToken: token,
    };
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { user_id: id },
    });

    if (!user) {
      return null;
    }

    const { password_hash, ...safeUser } = user;
    void password_hash;
    return withProfileCompleteness(safeUser);
  }

  async findAll() {
    const users = await this.prisma.user.findMany();

    return users.map(({ password_hash, ...user }) => {
      void password_hash;
      return withProfileCompleteness(user);
    });
  }

  async resendVerification(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.is_email_verified) {
      return {
        message: 'If the email exists, a verification email will be sent.',
      };
    }

    await this.prisma.emailVerificationToken.deleteMany({
      where: { user_id: user.user_id },
    });

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawToken);

    await this.prisma.emailVerificationToken.create({
      data: {
        token_hash: tokenHash,
        user_id: user.user_id,
        expires_at: new Date(Date.now() + 30 * 60 * 1000),
      },
    });

    await this.mailService.sendVerificationEmail(user.email, rawToken);

    return {
      message: 'If the email exists, a verification email will be sent.',
    };
  }

  private signToken(userId: string, email: string) {
    return jwt.sign(
      { sub: userId, email },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' },
    );
  }
  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  async update(id: string, dto: UpdateUserDto) {
    const {
      liked_foods,
      disliked_foods,
      food_allergies,
      preferred_food_types,
      health_goals_list,
      ...scalarData
    } = dto;

    const data = {
      ...scalarData,
      ...(liked_foods !== undefined && {
        liked_foods: liked_foods === null ? Prisma.DbNull : liked_foods,
      }),
      ...(disliked_foods !== undefined && {
        disliked_foods:
          disliked_foods === null ? Prisma.DbNull : disliked_foods,
      }),
      ...(food_allergies !== undefined && {
        food_allergies:
          food_allergies === null ? Prisma.DbNull : food_allergies,
      }),
      ...(preferred_food_types !== undefined && {
        preferred_food_types:
          preferred_food_types === null ? Prisma.DbNull : preferred_food_types,
      }),
      ...(health_goals_list !== undefined && {
        health_goals_list:
          health_goals_list === null ? Prisma.DbNull : health_goals_list,
      }),
    } satisfies Prisma.userUpdateInput;

    const user = await this.prisma.user.update({
      where: { user_id: id },
      data,
    });

    const { password_hash, ...safeUser } = user;
    void password_hash;
    return withProfileCompleteness(safeUser);
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    const genericResponse = {
      message: 'If the email exists, a password reset email will be sent.',
    };

    if (!user) {
      return genericResponse;
    }

    await this.prisma.forgetPasswordToken.deleteMany({
      where: { user_id: user.user_id },
    });

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawToken);

    await this.prisma.forgetPasswordToken.create({
      data: {
        token_hash: tokenHash,
        user_id: user.user_id,
        expires_at: new Date(Date.now() + 30 * 60 * 1000),
      },
    });

    await this.mailService.sendPasswordResetEmail(user.email, rawToken);

    return genericResponse;
  }

  async resetPassword(token: string, newPassword: string) {
    const tokenHash = this.hashToken(token);
    const resetToken = await this.prisma.forgetPasswordToken.findUnique({
      where: { token_hash: tokenHash },
    });

    if (
      !resetToken ||
      resetToken.used_at ||
      resetToken.expires_at < new Date()
    ) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { user_id: resetToken.user_id },
        data: { password_hash: passwordHash },
      }),
      this.prisma.forgetPasswordToken.update({
        where: { id: resetToken.id },
        data: { used_at: new Date() },
      }),
    ]);

    return { message: 'Password reset successfully' };
  }
}
