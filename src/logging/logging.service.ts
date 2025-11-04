import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityType } from '@prisma/client';

export interface AuditLogData {
  activityType: ActivityType;
  personalNumber: string;
  username?: string;
  method: string;
  route: string;
  details: Record<string, any>;
}

@Injectable()
export class LoggingService {
  constructor(private prisma: PrismaService) {}

  async createAuditLog(logData: AuditLogData) {
    return this.prisma.auditLog.create({
      data: {
        activityType: logData.activityType,
        personalNumber: logData.personalNumber,
        username: logData.username,
        method: logData.method,
        route: logData.route,
        details: logData.details,
      },
    });
  }
}
