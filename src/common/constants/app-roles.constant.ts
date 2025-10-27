import { Role } from '@prisma/client';

export const ADMIN_ROLES: Role[] = [
  Role.SUPER_ADMIN,
  Role.ADMIN,
  Role.TETRA_ADMIN,
  Role.LMS_ADMIN,
];
