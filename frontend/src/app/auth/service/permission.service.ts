import {Injectable} from '@angular/core';
import {User} from '@shared/user/user';
import {isNotNil, Nullable} from '@shared/util/util';
import {AuthenticationService} from '@fe/app/auth/service/authentication.service';
import {Permission} from '@shared/user/permission.enum';
import {cast} from '@shared/util/test-util';

@Injectable()
export class PermissionService {

    private permissionInfo: Record<Permission, boolean>;

    constructor(private readonly auth: AuthenticationService) {
        this.auth.currentUser.subscribe((user: Nullable<User>) => this.setup(user));
    }

    public has(permission: Permission): boolean {
        return this.permissionInfo[permission];
    }

    public get userId(): string | undefined {
        return this.auth.currentUserValue?.id;
    }

    public get personId(): string | undefined {
        return this.auth.currentUserValue?.personId;
    }

    private setup(user: Nullable<User>): void {
        let permissions: Array<Permission> = [];
        if (isNotNil(user)) {
            permissions = user.permissions;
        }
        this.setUpPermissionInfo(permissions);
    }

    private setUpPermissionInfo(permissions: Array<Permission>): void {
        this.permissionInfo = Object.values(Permission).reduce<Record<Permission, boolean>>(
            (result, current) => {
                result[current] = permissions.includes(current);
                return result;
            },
            cast<Record<Permission, boolean>>({})
        );
    }

}
