import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AuthErrorEnum } from '../enums/auth-message.enum';
import { RoleEnum } from '../enums/role.enum';
import { GlobalConstantKey } from '@/src/config/constant';
import { User } from '@/src/user/schema/user.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      GlobalConstantKey.ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const user = context.switchToHttp().getRequest().user as User;
    const result = requiredRoles.some((role) => role === user.role);

    if (result) return true;

    throw new ForbiddenException(AuthErrorEnum.FORBIDDEN);
  }
}
