import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { Role, AuditAction, AdminInvitationStatus, AdminInvitationRole } from '../../generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private auditService: AuditService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && user.accountStatus === 'active') {
      const isMatch = await bcrypt.compare(pass, user.passwordHash);
      if (isMatch) {
        const { passwordHash, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any, ipAddress?: string, userAgent?: string) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await this.auditService.log({
      actorUserId: user.id,
      action: AuditAction.login,
      targetEntityType: 'User',
      targetEntityId: user.id,
      ipAddress,
      userAgent,
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      }
    };
  }

  async logAuthFailure(email: string, ipAddress?: string, userAgent?: string) {
    // Audit log auth failure
    await this.auditService.log({
      action: AuditAction.auth_failure,
      targetEntityType: 'User',
      ipAddress,
      userAgent,
      metadata: { attemptedEmail: email },
    });
  }

  async register(data: any, ipAddress?: string, userAgent?: string) {
    const { email, password, firstName, lastName, phoneNumber, role } = data;

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const requestedRole = role || Role.applicant;

    if (requestedRole === Role.admin || requestedRole === Role.officer) {
      // S1-M2: Admin Registration only for pre-invited email addresses
      const invitation = await this.prisma.adminInvitation.findFirst({
        where: {
          email,
          role: requestedRole === Role.admin ? AdminInvitationRole.admin : AdminInvitationRole.officer,
          status: AdminInvitationStatus.pending,
          expiresAt: { gt: new Date() },
        },
      });

      if (!invitation) {
        throw new UnauthorizedException('Valid admin invitation required');
      }

      // We will mark it accepted after user creation
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await this.prisma.user.create({
        data: {
          email,
          passwordHash,
          fullName: `${firstName} ${lastName}`,
          phoneNumber,
          role: requestedRole,
        },
      });

      await this.prisma.adminInvitation.update({
        where: { id: invitation.id },
        data: {
          status: AdminInvitationStatus.accepted,
          acceptedByUserId: user.id,
          acceptedAt: new Date(),
        },
      });

      await this.auditService.log({
        actorUserId: user.id,
        action: AuditAction.register,
        targetEntityType: 'User',
        targetEntityId: user.id,
        ipAddress,
        userAgent,
        metadata: { role: requestedRole, invitationId: invitation.id },
      });

      return user;
    }

    // Applicant registration
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName: `${firstName} ${lastName}`,
        phoneNumber,
        role: requestedRole,
      },
    });

    await this.auditService.log({
      actorUserId: user.id,
      action: AuditAction.register,
      targetEntityType: 'User',
      targetEntityId: user.id,
      ipAddress,
      userAgent,
      metadata: { role: requestedRole },
    });

    return user;
  }
}
