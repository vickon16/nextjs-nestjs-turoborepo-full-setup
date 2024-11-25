import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const IS_PUBLIC = 'IS_PUBLIC';
export const Public = () => SetMetadata(IS_PUBLIC, true);

export const ROLES_KEY = 'ROLES';
export const Roles = (...roles: [Role, ...Role[]]) =>
  SetMetadata(ROLES_KEY, roles);
