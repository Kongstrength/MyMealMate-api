import 'dotenv/config';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend = new Resend(process.env.RESEND_API_KEY);

  async sendVerificationEmail(email: string, token: string) {
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const fromName = process.env.RESEND_FROM_NAME;

    if (!fromEmail || !fromName) {
      throw new InternalServerErrorException('Email configuration is missing');
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
      throw new InternalServerErrorException('ส่งอีเมลไม่สำเร็จ');
    }
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const fromName = process.env.RESEND_FROM_NAME;

    if (!fromEmail || !fromName) {
      throw new InternalServerErrorException('Email configuration is missing');
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
      this.logger.error(
        `Resend password reset error: ${JSON.stringify(error)}`,
      );
      throw new InternalServerErrorException('ส่งอีเมลไม่สำเร็จ');
    }
  }
}
