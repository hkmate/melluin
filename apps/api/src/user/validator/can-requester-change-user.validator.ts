import {User} from '@shared/user/user';
import {ForbiddenException} from '@nestjs/common';
import {UserEntity} from '@be/user/model/user.entity';
import {Permission} from '@shared/user/permission.enum';
import {UserRewriteValidator, UserRewriteWithEntity} from '@be/user/validator/user-rewrite.validator';
import {getPermissionsNeededToChangeRole} from '@shared/user/role';


export class CanRequesterChangeUserValidator implements UserRewriteValidator {


    constructor(private readonly currentUser: User) {
    }

    public static of(user: User): CanRequesterChangeUserValidator {
        return new CanRequesterChangeUserValidator(user);
    }

    public validate({entity, rewrite}: UserRewriteWithEntity): Promise<void> {
        if (this.isUserGotId(entity.id) && this.userHas(Permission.canWriteSelf)) {
            return Promise.resolve();
        }
        if (this.hasUserPermissionToChange(entity)) {
            return Promise.resolve();
        }
        throw new ForbiddenException('You have no permission to update this user');
    }

    private hasUserPermissionToChange(user: UserEntity): boolean {
        return user.roles.every(role => {
            const neededPermission = getPermissionsNeededToChangeRole(role.type);
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
