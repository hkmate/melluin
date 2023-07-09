import {User} from '@shared/user/user';
import {getPermissionsNeededToChangeRole, Role} from '@shared/user/role.enum';
import {ForbiddenException} from '@nestjs/common';
import {UserEntity} from '@be/user/model/user.entity';
import {Permission} from '@shared/user/permission.enum';
import {UserRewriteValidator, UserRewriteWithEntity} from '@be/user/validator/user-rewrite.validator';
import * as _ from 'lodash';


export class CanRequesterChangeUsersRoleValidator implements UserRewriteValidator {

    constructor(private readonly currentUser: User) {
    }

    public static of(user: User): CanRequesterChangeUsersRoleValidator {
        return new CanRequesterChangeUsersRoleValidator(user);
    }

    public validate(rewriteWithEntity: UserRewriteWithEntity): Promise<void> {
        if (!this.areRolesChanged(rewriteWithEntity)) {
            return Promise.resolve();
        }
        if (this.hasUserPermissionToChange(rewriteWithEntity)) {
            return Promise.resolve();
        }
        throw new ForbiddenException('You have no permission to update these roles');
    }

    private areRolesChanged({entity, rewrite}: UserRewriteWithEntity): boolean {
        return !_.isEqual(
            entity.roles.map(value => value.role),
            rewrite.roles
        );
    }

    private hasUserPermissionToChange({entity, rewrite}: UserRewriteWithEntity): boolean {
        return this.canRequesterChangeUser(entity)
            && this.canRequesterManageRoles(rewrite.roles);
    }

    private canRequesterChangeUser(user: UserEntity): boolean {
        return this.canRequesterManageRoles(user.roles.map(r => r.role));
    }

    private canRequesterManageRoles(roles: Array<Role>): boolean {
        return roles.every(role => {
            const neededPermission = getPermissionsNeededToChangeRole(role);
            return this.userHas(neededPermission);
        }) ?? false;
    }

    private userHas(permission: Permission): boolean {
        return this.currentUser.permissions.includes(permission);
    }

}
