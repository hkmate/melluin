import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {isNil} from '@shared/util/util';
import {PERMISSIONS_KEY} from '@be/auth/decorator/permissions.decorator';
import {Permission} from '@shared/user/permission.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {

    constructor(private reflector: Reflector) {
    }

    public canActivate(context: ExecutionContext): boolean {
        const requiredPermissions: Array<Permission>
            = this.reflector.getAllAndOverride<Array<Permission>>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isNil(requiredPermissions)) {
            return true;
        }
        const {user} = context.switchToHttp().getRequest();
        return requiredPermissions.some((p: Permission) => user.permissions?.includes(p));
    }

}
