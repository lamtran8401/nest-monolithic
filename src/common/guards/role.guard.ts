import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/apis/users/entities/user.entity';
import { MetadataKey } from '../constant';
import { Role } from '../enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiresRole = this.reflector.getAllAndOverride<Role[]>(MetadataKey.ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiresRole || requiresRole.length === 0) return true;

    const request: Express.Request = context.switchToHttp().getRequest();
    const user = request.user as User;

    if (!requiresRole.includes(user.role)) throw new ForbiddenException('Permission denied');

    return true;
  }
}
