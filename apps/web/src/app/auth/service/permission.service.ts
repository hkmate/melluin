import {computed, inject, Injectable} from '@angular/core';
import {isNotNil, Permission, RoleType, UUID} from '@melluin/common';
import {CurrentUserService} from '@fe/app/auth/service/current-user.service';

@Injectable({providedIn: 'root'})
export class PermissionService {

    private readonly currentUserService = inject(CurrentUserService);

    private readonly currentUser = this.currentUserService.currentUser;
    private readonly permissionInfo = computed(() => this.calculatePermissionInfo(this.currentUser()?.permissions ?? []));

    public has(permission: Permission): boolean {
        return this.permissionInfo()[permission];
    }

    public get userId(): UUID | undefined {
        return this.currentUser()?.id;
    }

    public get personId(): UUID | undefined {
        return this.currentUser()?.personId;
    }

    public getRolesTypesCanBeManaged(): Array<RoleType> {
        const permissionToRolesMap = {
            [Permission.canWriteVisitor]: [RoleType.VISITOR, RoleType.INTERN],
            [Permission.canWriteCoordinator]: [RoleType.COORDINATOR],
            [Permission.canWriteAdmin]: [RoleType.ADMINISTRATOR],
            [Permission.canWriteSysAdmin]: [RoleType.SYSADMIN]
        }
        return this.listPermissions()
            .map(p => permissionToRolesMap[p])
            .filter(r => isNotNil(r))
            .flat();
    }

    private calculatePermissionInfo(permissions: Array<Permission>): Record<Permission, boolean> {
        return Object.values(Permission).reduce<Record<Permission, boolean>>(
            (result, current) => {
                result[current] = permissions.includes(current);
                return result;
            },
            {} as Record<Permission, boolean>
        );
    }

    private listPermissions(): Array<Permission> {
        return Object.values(Permission).filter(p => this.has(p));
    }

}
