import { CanActivate, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
export type AuthenticatedRequest = Request & {
    user: {
        sub: string;
        email: string;
    };
};
export declare class JwtAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
