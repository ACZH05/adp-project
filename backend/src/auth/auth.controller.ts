import { Controller, Post, Body, Req, UnauthorizedException, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any, @Req() req: any) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      await this.authService.logAuthFailure(body.email, req.ip, req.headers['user-agent']);
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user, req.ip, req.headers['user-agent']);
  }

  @Public()
  @Post('register')
  async register(@Body() body: any, @Req() req: any) {
    const user = await this.authService.register(body, req.ip, req.headers['user-agent']);
    // Log them in immediately after register
    return this.authService.login(user, req.ip, req.headers['user-agent']);
  }

  // INT-07: Centralized auth validation for internal subsystems
  @Public() // It validates the token provided in the body
  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validate(@Body() body: { token: string; targetResource?: string; requestedAction?: string }) {
    try {
      const payload = this.jwtService.verify(body.token);
      return {
        decision: 'allow',
        subjectId: payload.sub,
        roleClaims: [payload.role],
        expiry: payload.exp,
      };
    } catch (e) {
      return {
        decision: 'deny',
        denialReason: 'Invalid or expired token',
      };
    }
  }
}
