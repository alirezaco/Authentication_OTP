import { GlobalConstantKey } from '@/src/config/constant';
import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../enums/role.enum';

export const Role = (...args: RoleEnum[]) =>
  SetMetadata(GlobalConstantKey.ROLES_KEY, args);
