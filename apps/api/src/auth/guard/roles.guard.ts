import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {ROLES_KEY} from '../decorator/roles.decorator';
import {isNil} from '@shared/util/util';
import {RoleType} from '@shared/user/role';

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector) {
    }

    public canActivate(context: ExecutionContext): boolean {
        const requiredRoles: Array<RoleType> = this.reflector.getAllAndOverride<Array<RoleType>>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isNil(requiredRoles)) {
            return true;
        }
        const {user} = context.switchToHttp().getRequest();
        return requiredRoles.some((role: RoleType) => user.roles.map(r => r.type)?.includes(role));
    }

}
