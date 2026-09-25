"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const crypto_1 = require("crypto");
const client_1 = require("@prisma/client");
const profile_completeness_1 = require("./profile-completeness");
let UsersService = class UsersService {
    prisma;
    mailService;
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
    }
    async register(dto) {
        if (!dto.username || !dto.email || !dto.password) {
            throw new common_1.BadRequestException('Username, email, and password are required');
        }
        const birthday = new Date(dto.birthday);
        const today = new Date();
        if (birthday > today) {
            throw new common_1.BadRequestException('วันเกิดต้องไม่เป็นวันที่ในอนาคต');
        }
        let age = today.getUTCFullYear() - birthday.getUTCFullYear();
        const birthdayPassedThisYear = today.getUTCMonth() > birthday.getUTCMonth() ||
            (today.getUTCMonth() === birthday.getUTCMonth() &&
                today.getUTCDate() >= birthday.getUTCDate());
        if (!birthdayPassedThisYear)
            age -= 1;
        if (age > 120) {
            throw new common_1.BadRequestException('วันเกิดต้องมีอายุไม่เกิน 120 ปี');
        }
        const exists = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: dto.email }, { username: dto.username }],
            },
        });
        if (exists) {
            throw new common_1.BadRequestException('Email or username already exists');
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
                liked_foods: dto.liked_foods ?? client_1.Prisma.DbNull,
                disliked_foods: dto.disliked_foods ?? client_1.Prisma.DbNull,
                food_allergies: dto.food_allergies ?? client_1.Prisma.DbNull,
                preferred_food_types: dto.preferred_food_types ?? client_1.Prisma.DbNull,
                health_goals_list: dto.health_goals_list ?? client_1.Prisma.DbNull,
            },
        });
        const rawToken = (0, crypto_1.randomBytes)(32).toString('hex');
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
            message: 'Registration successful. Please check your email to verify your account.',
        };
    }
    async verifyEmail(token) {
        if (!token?.trim()) {
            throw new common_1.BadRequestException('Verification token is required');
        }
        const tokenHash = this.hashToken(token.trim());
        const verificationToken = await this.prisma.emailVerificationToken.findUnique({
            where: { token_hash: tokenHash },
        });
        if (!verificationToken ||
            verificationToken.used_at ||
            verificationToken.expires_at < new Date()) {
            throw new common_1.BadRequestException('Invalid or expired verification token');
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
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!dto.email || !dto.password) {
            throw new common_1.BadRequestException('Email and password are required');
        }
        if (!user || !user.password_hash) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.password_hash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.is_email_verified) {
            throw new common_1.UnauthorizedException('Please verify your email first');
        }
        const token = this.signToken(user.user_id, user.email);
        const { password_hash, ...safeUser } = user;
        void password_hash;
        return {
            user: (0, profile_completeness_1.withProfileCompleteness)(safeUser),
            accessToken: token,
        };
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { user_id: id },
        });
        if (!user) {
            return null;
        }
        const { password_hash, ...safeUser } = user;
        void password_hash;
        return (0, profile_completeness_1.withProfileCompleteness)(safeUser);
    }
    async findAll() {
        const users = await this.prisma.user.findMany();
        return users.map(({ password_hash, ...user }) => {
            void password_hash;
            return (0, profile_completeness_1.withProfileCompleteness)(user);
        });
    }
    async resendVerification(email) {
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
        const rawToken = (0, crypto_1.randomBytes)(32).toString('hex');
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
    signToken(userId, email) {
        return jwt.sign({ sub: userId, email }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
    }
    hashToken(token) {
        return (0, crypto_1.createHash)('sha256').update(token).digest('hex');
    }
    async update(id, dto) {
        const { liked_foods, disliked_foods, food_allergies, preferred_food_types, health_goals_list, ...scalarData } = dto;
        const data = {
            ...scalarData,
            ...(liked_foods !== undefined && {
                liked_foods: liked_foods === null ? client_1.Prisma.DbNull : liked_foods,
            }),
            ...(disliked_foods !== undefined && {
                disliked_foods: disliked_foods === null ? client_1.Prisma.DbNull : disliked_foods,
            }),
            ...(food_allergies !== undefined && {
                food_allergies: food_allergies === null ? client_1.Prisma.DbNull : food_allergies,
            }),
            ...(preferred_food_types !== undefined && {
                preferred_food_types: preferred_food_types === null ? client_1.Prisma.DbNull : preferred_food_types,
            }),
            ...(health_goals_list !== undefined && {
                health_goals_list: health_goals_list === null ? client_1.Prisma.DbNull : health_goals_list,
            }),
        };
        const user = await this.prisma.user.update({
            where: { user_id: id },
            data,
        });
        const { password_hash, ...safeUser } = user;
        void password_hash;
        return (0, profile_completeness_1.withProfileCompleteness)(safeUser);
    }
    async forgotPassword(email) {
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
        const rawToken = (0, crypto_1.randomBytes)(32).toString('hex');
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
    async resetPassword(token, newPassword) {
        const tokenHash = this.hashToken(token);
        const resetToken = await this.prisma.forgetPasswordToken.findUnique({
            where: { token_hash: tokenHash },
        });
        if (!resetToken ||
            resetToken.used_at ||
            resetToken.expires_at < new Date()) {
            throw new common_1.BadRequestException('Invalid or expired password reset token');
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], UsersService);
//# sourceMappingURL=users.service.js.map