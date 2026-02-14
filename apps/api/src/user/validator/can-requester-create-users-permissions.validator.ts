import {User} from '@shared/user/user';
import {ForbiddenException} from '@nestjs/common';
import {Permission} from '@shared/user/permission.enum';
import {AsyncValidator} from '@shared/validator/validator';
import {UserCreation} from '@shared/user/user-creation';
import {isNilOrEmpty} from '@shared/util/util';


export class CanRequesterCreateUsersPermissionsValidator implements AsyncValidator<UserCreation> {

    constructor(private readonly currentUser: User) {
    }

    public static of(user: User): CanRequesterCreateUsersPermissionsValidator {
        return new CanRequesterCreateUsersPermissionsValidator(user);
    }

    public validate(newUser: UserCreation): Promise<void> {
        if (isNilOrEmpty(newUser.customPermissions)) {
            return Promise.resolve();
        }
        if (this.userHas(Permission.canManagePermissions)) {
            return Promise.resolve();
        }
        throw new ForbiddenException('You have no permission to create user with custom permissions');
    }

    private userHas(permission: Permission): boolean {
        return this.currentUser.permissions.includes(permission);
    }

}
