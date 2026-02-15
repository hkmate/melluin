import {
    AsyncValidator,
    getPermissionsNeededToChangeRole,
    Permission,
    RoleType,
    User,
    UserCreation
} from '@melluin/common';
import {ForbiddenException} from '@nestjs/common';
import {RoleDao} from '@be/user/role.dao';
import {RoleEntity} from '@be/user/model/role.entity';

export class CanRequesterCreateUsersRoleValidator implements AsyncValidator<UserCreation> {

    constructor(private readonly roleDao: RoleDao,
                private readonly currentUser: User) {
    }

    public async validate(userCreation: UserCreation): Promise<void> {
        const requiredRoles = await this.getRoles(userCreation.roleNames);
        if (this.hasUserPermissionToChange(requiredRoles)) {
            return Promise.resolve();
        }
        throw new ForbiddenException('You have no permission to update these roles');
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
