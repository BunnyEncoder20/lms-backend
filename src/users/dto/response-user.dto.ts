import { Exclude } from 'class-transformer';
import { Rank, Role } from '@prisma/client';

export class ResponseUserDto {
  // --- Fields SENT TO THE CLIENT (Public/Necessary) ---
  personalNumber: string;
  firstName: string;
  lastName: string;
  // Use '?' for optional and '| null' for DB NULL values
  email?: string | null;
  rank: Rank;
  role: Role;

  // Timestamps and status are generally included for transparency
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;

  // --- Fields EXCLUDED FROM THE RESPONSE (Security/Internal) ---
  @Exclude() passwordHash: string;
  @Exclude() refreshTokenHash?: string | null;
  @Exclude() failedLoginAttempts?: number | null;
  @Exclude() createdBy?: string | null;
  @Exclude() updatedBy?: string | null;
  @Exclude() lastPasswordChangeAt?: Date | null;
  @Exclude() deletedAt?: Date | null;

  // * Note: Prisma Int? maps to 'number | null' in TypeScript
  // * Prisma String? maps to 'string | null' in TypeScript

  // The constructor is necessary to create a class instance from the plain DB object,
  // allowing the ClassSerializerInterceptor to find and apply the @Exclude() decorators.
  constructor(partial: Partial<ResponseUserDto>) {
    Object.assign(this, partial);
  }
}
