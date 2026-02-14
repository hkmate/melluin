import {User} from '@shared/user/user';
import {ForbiddenException} from '@nestjs/common';
import {Permission} from '@shared/user/permission.enum';
import {UserRewriteWithEntity} from '@be/user/validator/user-rewrite.validator';
import * as _ from 'lodash';
import {AsyncValidator} from '@shared/validator/validator';


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

    private userHas(permission: Permission): boolean {
        return this.currentUser.permissions.includes(permission);
    }

}
