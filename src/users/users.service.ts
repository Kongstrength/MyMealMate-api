// src/users/users.service.ts
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

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: CreateUserDto) {
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
        age: dto.age ?? null,
        gender: dto.gender ?? null,
        height: dto.height ?? null,
        weight: dto.weight ?? null,
        bmi: dto.bmi ?? 0,
        birthday: dto.birthday ?? null,
        activity_level: dto.activity_level ?? 'SEDENTARY',
        budget_daily: dto.budget_daily ?? 0,
        budget_weekly: dto.budget_weekly ?? 0,
        budget_monthly: dto.budget_monthly ?? 0,
        calories_per_day: dto.calories_per_day ?? 0,
        daily_target_calories: dto.daily_target_calories ?? 0,
        liked_foods: dto.liked_foods ?? null,
        preferred_food_types: dto.preferred_food_types ?? null,
        health_goals_list: dto.health_goals_list ?? null,
      },
    });

    const token = this.signToken(user.user_id, user.email);

    const { password_hash: _, ...safeUser } = user;
    return {
      user: safeUser,
      accessToken: token,
    };
  }

  async login(dto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.password_hash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.signToken(user.user_id, user.email);

    const { password_hash: _, ...safeUser } = user;
    return {
      user: safeUser,
      accessToken: token,
    };
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { user_id: id },
    });
  }

  async findAll() {
    const users = await this.prisma.user.findMany();

    return users.map(({ password_hash, ...user }) => user);
  }

  private signToken(userId: string, email: string) {
    return jwt.sign(
      { sub: userId, email },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' },
    );
  }
}