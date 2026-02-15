import {AsyncValidator, isNilOrEmpty, Permission, User, UserCreation} from '@melluin/common';
import {ForbiddenException} from '@nestjs/common';


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
