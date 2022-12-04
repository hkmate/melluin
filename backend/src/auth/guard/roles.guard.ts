import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {ROLES_KEY} from '../decorator/roles.decorator';
import {Role} from '@shared/user/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector) {
    }

    public canActivate(context: ExecutionContext): boolean {
        const requiredRoles: Array<Role> = this.reflector.getAllAndOverride<Array<Role>>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        // eslint-disable-next-line no-undefined
        if (requiredRoles === null || requiredRoles === undefined) {
            return true;
        }
        const {user} = context.switchToHttp().getRequest();
        return requiredRoles.some((role: Role) => user.roles?.includes(role));
    }

}
