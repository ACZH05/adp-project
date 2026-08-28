import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Role, AdminInvitationRole, AdminInvitationStatus } from '../generated/prisma/client.js';
import * as crypto from 'crypto';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async createAdminInvitation(email: string, role: AdminInvitationRole, invitedByUserId: string) {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const existingInvite = await this.prisma.adminInvitation.findFirst({
      where: { email, status: AdminInvitationStatus.pending },
    });

    if (existingInvite && existingInvite.expiresAt > new Date()) {
      return { token: null, message: 'Invitation already pending for this email' };
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = await bcryptjs.hash(token, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Valid for 7 days

    await this.prisma.adminInvitation.create({
      data: { 
        email, 
        tokenHash, 
        expiresAt, 
        role,
        invitedByUserId,
      },
    });
    
    return { token };
  }

  async validateInvitation(email: string, token: string) {
    const invitations = await this.prisma.adminInvitation.findMany({
      where: { email, status: AdminInvitationStatus.pending },
    });

    for (const inv of invitations) {
      if (inv.expiresAt > new Date() && await bcryptjs.compare(token, inv.tokenHash)) {
        return inv;
      }
    }
    return null;
  }

  async markInvitationUsed(id: string, acceptedByUserId: string) {
    return this.prisma.adminInvitation.update({
      where: { id },
      data: { 
        status: AdminInvitationStatus.accepted,
        acceptedAt: new Date(),
        acceptedByUserId
      },
    });
  }
}
