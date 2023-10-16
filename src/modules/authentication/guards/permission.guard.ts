import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const guardPermissions: string[] = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    if (!guardPermissions?.length) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const userPermissions = [...user?.roles.map(role => role.permissions.map(permission => permission.name))].flat();

    const resp = this.matchRoles(guardPermissions, userPermissions);

    if (!resp) throw new UnauthorizedException("User unauthorized, user not having necessary permissions")

    return resp;
  }

  matchRoles(guardPermissions: string[], userPermissions: string[]): boolean {
    let allowed = false;

    for (let permission of guardPermissions) {
      allowed = userPermissions.includes(permission);

      if (allowed) break;
    }

    return allowed;
  }
}
