import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {ROLES_KEY} from '../decorator/roles.decorator';
import {Role} from '@shared/user/role.enum';
import {isNil} from '@shared/util/util';

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector) {
    }

    public canActivate(context: ExecutionContext): boolean {
        const requiredRoles: Array<Role> | null = this.reflector.getAllAndOverride<Array<Role> | null>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isNil(requiredRoles)) {
            return true;
        }
        const {user} = context.switchToHttp().getRequest();
        return requiredRoles.some((role: Role) => user.roles?.includes(role));
    }

}
