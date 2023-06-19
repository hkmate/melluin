import {Injectable} from '@angular/core';
import {User} from '@shared/user/user';
import {isNotNil, Nullable} from '@shared/util/util';
import {AuthenticationService} from '@fe/app/auth/service/authentication.service';
import {Permission} from '@shared/user/permission.enum';
import {cast} from '@shared/util/test-util';
import {Role} from '@shared/user/role.enum';

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

    public getRolesCanBeManaged(): Array<Role> {
        const permissionToRolesMap = {
            [Permission.canWriteVisitor]: [Role.HOSPITAL_VISITOR, Role.BEGINNER_HOSPITAL_VISITOR,
                Role.INTERN_HOSPITAL_VISITOR, Role.MENTOR_HOSPITAL_VISITOR],
            [Permission.canWriteCoordinator]: [Role.HOSPITAL_VISIT_COORDINATOR, Role.FAIRY_PAINTING_COORDINATOR, Role.TOY_MAKING_COORDINATOR],
            [Permission.canWriteAdmin]: [Role.ADMINISTRATOR],
            [Permission.canWriteSysAdmin]: [Role.SYSADMIN]
        }
        return this.listPermissions()
            .map(p => permissionToRolesMap[p])
            .filter(r => isNotNil(r))
            .flat();
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

    private listPermissions(): Array<Permission> {
        return Object.values(Permission).filter(p => this.has(p));
    }

}
