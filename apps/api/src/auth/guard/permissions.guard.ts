import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {isNil, PermissionT} from '@melluin/common';
import {PERMISSIONS_KEY} from '@be/auth/decorator/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {

    constructor(private reflector: Reflector) {
    }

    public canActivate(context: ExecutionContext): boolean {
        const requiredPermissions: Array<PermissionT>
            = this.reflector.getAllAndOverride<Array<PermissionT>>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isNil(requiredPermissions)) {
            return true;
        }
        const {user} = context.switchToHttp().getRequest();
        return requiredPermissions.some((p: PermissionT): boolean => user.permissions?.includes(p));
    }

}
