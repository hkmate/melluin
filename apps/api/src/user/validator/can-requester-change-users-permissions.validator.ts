import {AsyncValidator, Permission, PermissionT, User} from '@melluin/common';
import {ForbiddenException} from '@nestjs/common';
import {UserRewriteWithEntity} from '@be/user/validator/user-rewrite.validator';
import * as _ from 'lodash';


export class CanRequesterChangeUsersPermissionsValidator implements AsyncValidator<UserRewriteWithEntity> {

    constructor(private readonly currentUser: User) {
    }

    public static of(user: User): CanRequesterChangeUsersPermissionsValidator {
        return new CanRequesterChangeUsersPermissionsValidator(user);
    }

    public validate(rewriteWithEntity: UserRewriteWithEntity): Promise<void> {
        if (!this.arePermissionsChanged(rewriteWithEntity)) {
            return Promise.resolve();
        }
        if (this.userHas(Permission.canManagePermissions)) {
            return Promise.resolve();
        }
        throw new ForbiddenException('You have no permission to change custom permissions on this user');
    }

    private arePermissionsChanged({entity, rewrite}: UserRewriteWithEntity): boolean {
        return !_.isEqual(
            entity.customPermissions.map(value => value.permission),
            rewrite.customPermissions
        );
    }

    private userHas(permission: PermissionT): boolean {
        return this.currentUser.permissions.includes(permission);
    }

}
