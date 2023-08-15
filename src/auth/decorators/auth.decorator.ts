import { applyDecorators, UseGuards } from '@nestjs/common';
import { RoleEnum } from '../enums/role.enum';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Role } from './role.decorator';

export function AuthDec(...roles: RoleEnum[]) {
  return applyDecorators(Role(...roles), UseGuards(JwtAuthGuard, RolesGuard));
}
