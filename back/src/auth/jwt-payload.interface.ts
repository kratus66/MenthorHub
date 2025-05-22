// src/auth/jwt-payload.interface.ts
import { Role } from '../common/constants/roles.enum';

export interface JwtPayload {
  email: string;
  sub: string;
  role: Role;
}
