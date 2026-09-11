import 'dotenv/config';
export declare class MailService {
    private readonly logger;
    private readonly resend;
    sendVerificationEmail(email: string, token: string): Promise<void>;
    sendPasswordResetEmail(email: string, token: string): Promise<void>;
}
