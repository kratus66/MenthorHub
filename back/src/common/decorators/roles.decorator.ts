import { SetMetadata } from '@nestjs/common';
import { Role } from '../constants/roles.enum'; // ajusta la ruta según tu estructura

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

