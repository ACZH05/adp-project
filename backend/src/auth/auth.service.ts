import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuditService } from '../audit/audit.service';
import * as bcryptjs from 'bcryptjs';
import { Role, AuditAction } from '../generated/prisma/client.js';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private auditService: AuditService,
  ) {}

  async validateUser(email: string, pass: string, ipAddress?: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.accountStatus === 'active' && await bcryptjs.compare(pass, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      
      // Emit audit log for login (S1-FR-06)
      await this.auditService.logAction(AuditAction.login, 'User', user.id, user.id, null, ipAddress);

      return result;
    }
    
    // In a real app we might want to log failures differently, 
    // but the actual schema only has AuditLog, no AuthLog.
    if (user) {
      await this.auditService.logAction(AuditAction.login, 'User', user.id, user.id, { status: 'FAILURE' }, ipAddress);
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      }
    };
  }

  async registerApplicant(data: any, ipAddress?: string) {
    const existing = await this.usersService.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const salt = await bcryptjs.genSalt(10);
    const passwordHash = await bcryptjs.hash(data.password, salt);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        fullName: data.fullName,
        passwordHash,
        role: Role.applicant,
      },
    });

    await this.auditService.logAction(AuditAction.login, 'User', user.id, user.id, { action: 'REGISTER' }, ipAddress);

    const { passwordHash: _, ...result } = user;
    return result;
  }
  
  async registerAdmin(data: any, ipAddress?: string) {
    const invitation = await this.usersService.validateInvitation(data.email, data.token);
    if (!invitation) {
      throw new UnauthorizedException('Invalid or expired invitation token');
    }

    const existing = await this.usersService.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const salt = await bcryptjs.genSalt(10);
    const passwordHash = await bcryptjs.hash(data.password, salt);

    // Map AdminInvitationRole to User Role
    const userRole = invitation.role === 'admin' ? Role.admin : Role.officer;

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        fullName: data.fullName,
        passwordHash,
        role: userRole,
      },
    });

    await this.usersService.markInvitationUsed(invitation.id, user.id);

    await this.auditService.logAction(AuditAction.login, 'User', user.id, user.id, { action: 'ADMIN_REGISTER' }, ipAddress);

    const { passwordHash: _, ...result } = user;
    return result;
  }

  async validateTokenForInternal(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return {
        decision: 'allow',
        subjectId: payload.sub,
        roleClaims: payload.role,
        expiry: payload.exp,
        auditReferenceId: `auth-val-${Date.now()}`
      };
    } catch (e) {
      return {
        decision: 'deny',
        denialReason: e.message,
        auditReferenceId: `auth-val-${Date.now()}`
      };
    }
  }
}
