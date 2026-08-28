import { Controller, Post, Body, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any, @Req() req: any) {
    return this.authService.registerApplicant(body, req.ip);
  }

  @Post('register-admin')
  async registerAdmin(@Body() body: any, @Req() req: any) {
    return this.authService.registerAdmin(body, req.ip);
  }

  @Post('login')
  async login(@Body() body: any, @Req() req: any) {
    const user = await this.authService.validateUser(body.email, body.password, req.ip);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }
}

@Controller('internal/auth')
export class InternalAuthController {
  constructor(private authService: AuthService) {}

  @Post('validate')
  async validateInternalToken(@Body() body: any) {
    // S1-FR-07: Centralized auth validation for internal requests
    // Expects { token: string }
    return this.authService.validateTokenForInternal(body.token);
  }
}
