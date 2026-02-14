import {User} from '@shared/user/user';
import {ForbiddenException} from '@nestjs/common';
import {Permission} from '@shared/user/permission.enum';
import {UserRewriteValidator, UserRewriteWithEntity} from '@be/user/validator/user-rewrite.validator';
import * as _ from 'lodash';
import {getPermissionsNeededToChangeRole, RoleType} from '@shared/user/role';
import {RoleDao} from '@be/user/role.dao';
import {RoleEntity} from '@be/user/model/role.entity';

export class CanRequesterChangeUsersRoleValidator implements UserRewriteValidator {

    constructor(private readonly roleDao: RoleDao,
                private readonly currentUser: User) {
    }

    public async validate(rewriteWithEntity: UserRewriteWithEntity): Promise<void> {
        if (!this.areRolesChanged(rewriteWithEntity)) {
            return Promise.resolve();
        }

        const requiredRoles = await this.getRoles(rewriteWithEntity.rewrite.roleNames);
        if (this.hasUserPermissionToChange([...rewriteWithEntity.entity.roles, ...requiredRoles])) {
            return Promise.resolve();
        }
        throw new ForbiddenException('You have no permission to update these roles');
    }

    private areRolesChanged({entity, rewrite}: UserRewriteWithEntity): boolean {
        return !_.isEqual(
            entity.roles.map(value => value.name),
            rewrite.roleNames
        );
    }

    private hasUserPermissionToChange(roleTypes: Array<{ type: RoleType }>): boolean {
        return roleTypes.every(role => {
            const neededPermission = getPermissionsNeededToChangeRole(role.type);
            return this.userHas(neededPermission);
        }) ?? false;
    }

    private userHas(permission: Permission): boolean {
        return this.currentUser.permissions.includes(permission);
    }

    private getRoles(names: Array<string>): Promise<Array<RoleEntity>> {
        return this.roleDao.findAllByName(names);
    }

}
