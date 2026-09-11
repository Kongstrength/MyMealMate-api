"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
require("dotenv/config");
const common_1 = require("@nestjs/common");
const resend_1 = require("resend");
let MailService = MailService_1 = class MailService {
    logger = new common_1.Logger(MailService_1.name);
    resend = new resend_1.Resend(process.env.RESEND_API_KEY);
    async sendVerificationEmail(email, token) {
        const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
        const fromEmail = process.env.RESEND_FROM_EMAIL;
        const fromName = process.env.RESEND_FROM_NAME;
        if (!fromEmail || !fromName) {
            throw new common_1.InternalServerErrorException('Email configuration is missing');
        }
        const link = `${frontendUrl}/verify-email?token=${encodeURIComponent(token)}`;
        const { error } = await this.resend.emails.send({
            from: `${fromName} <${fromEmail}>`,
            to: email,
            subject: 'ยืนยันอีเมลของคุณ',
            html: `
        <h2>ยืนยันอีเมล</h2>
        <p>กรุณาคลิกลิงก์ด้านล่างเพื่อยืนยันอีเมล:</p>
        <a href="${link}">ยืนยันอีเมล</a>
        <p>ลิงก์นี้หมดอายุภายใน 30 นาที</p>
      `,
        });
        if (error) {
            this.logger.error(`Resend error: ${JSON.stringify(error)}`);
            throw new common_1.InternalServerErrorException('ส่งอีเมลไม่สำเร็จ');
        }
    }
    async sendPasswordResetEmail(email, token) {
        const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
        const fromEmail = process.env.RESEND_FROM_EMAIL;
        const fromName = process.env.RESEND_FROM_NAME;
        if (!fromEmail || !fromName) {
            throw new common_1.InternalServerErrorException('Email configuration is missing');
        }
        const link = `${frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;
        const { error } = await this.resend.emails.send({
            from: `${fromName} <${fromEmail}>`,
            to: email,
            subject: 'ตั้งรหัสผ่านใหม่',
            html: `
        <h2>ตั้งรหัสผ่านใหม่</h2>
        <p><a href="${link}">คลิกที่นี่เพื่อตั้งรหัสผ่านใหม่</a></p>
        <p>ลิงก์นี้หมดอายุภายใน 30 นาที และใช้ได้เพียงครั้งเดียว</p>
      `,
        });
        if (error) {
            this.logger.error(`Resend password reset error: ${JSON.stringify(error)}`);
            throw new common_1.InternalServerErrorException('ส่งอีเมลไม่สำเร็จ');
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)()
], MailService);
//# sourceMappingURL=mail.service.js.map