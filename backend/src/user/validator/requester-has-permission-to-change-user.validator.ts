import {Validator} from '@shared/validator/validator';
import {User} from '@shared/user/user';
import {getPermissionsNeededToChangeRole} from '@shared/user/role.enum';
import {ForbiddenException} from '@nestjs/common';
import {UserEntity} from '@be/user/model/user.entity';
import {UserUpdate} from '@shared/user/user-update';
import {Permission} from '@shared/user/permission.enum';

interface ChangeSetWithEntity {
    entity: UserEntity,
    changeSet: UserUpdate
}

export class RequesterHasPermissionToChangeUserValidator implements Validator<ChangeSetWithEntity> {


    constructor(private readonly currentUser: User) {
    }

    public static of(user: User): RequesterHasPermissionToChangeUserValidator {
        return new RequesterHasPermissionToChangeUserValidator(user);
    }

    public validate({entity, changeSet}: ChangeSetWithEntity): void {
        if (this.isUserGotId(entity.id) && this.userHas(Permission.canWriteSelf)) {
            return;
        }
        if (this.hasUserPermissionToChange(entity)) {
            return;
        }
        throw new ForbiddenException('You have no permission to update this user');
    }

    private hasUserPermissionToChange(user: UserEntity): boolean {
        return user.roles.every(role => {
            const neededPermission = getPermissionsNeededToChangeRole(role.role);
            return this.userHas(neededPermission);
        }) ?? false;
    }

    private isUserGotId(userId: string): boolean {
        return this.currentUser.id === userId;
    }

    private userHas(permission: Permission): boolean {
        return this.currentUser.permissions.includes(permission);
    }

}
