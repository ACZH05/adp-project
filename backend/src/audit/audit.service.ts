import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuditAction } from '../generated/prisma/client.js';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async logAction(
    action: AuditAction,
    targetEntityType: string,
    targetEntityId?: string,
    actorUserId?: string,
    metadata?: any,
    ipAddress?: string,
    userAgent?: string,
  ) {
    return this.prisma.auditLog.create({
      data: {
        action,
        targetEntityType,
        targetEntityId,
        actorUserId,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null,
        ipAddress,
        userAgent,
      },
    });
  }
}
