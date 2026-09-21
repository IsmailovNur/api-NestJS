import { Role } from '../types.js';
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: Role[]) => {
  return SetMetadata('roles', roles);
};
