import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

export const IS_PUBLIC_KEY = 'isPublic';

// Mock implementation for INT-16 / S5-FR-10: Require successful auth validation from S1
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Missing authorization header');
    }

    // In a real system (INT-16), this would make a request to S1 for AuthValidationResult
    // Mock S1 Validation:
    // "Bearer mock-applicant-token" -> Valid applicant
    // "Bearer mock-admin-token" -> Valid admin
    
    const token = authHeader.replace('Bearer ', '').trim();
    
    if (token === 'mock-admin-token') {
      request['user'] = { id: 'admin-1', roles: ['admin'] };
      return true;
    }

    if (token === 'mock-applicant-token') {
      request['user'] = { id: 'applicant-1', roles: ['applicant'] };
      return true;
    }

    this.logger.warn(`Auth validation failed for token: ${token}`);
    throw new UnauthorizedException('Invalid or expired token from S1');
  }
}
