import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role, AdminInvitationRole } from '../generated/prisma/client.js';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('admin-invitations')
  @Roles(Role.admin)
  async inviteAdmin(@Body() body: { email: string; role: AdminInvitationRole }, @Req() req: any) {
    const invitation = await this.usersService.createAdminInvitation(
      body.email, 
      body.role || AdminInvitationRole.officer,
      req.user.id
    );
    return {
      message: 'Invitation processed',
      token: invitation.token, // In a real app, send an email instead of returning token
    };
  }
}
