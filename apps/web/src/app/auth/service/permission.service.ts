import {computed, inject, Injectable} from '@angular/core';
import {isNotNil, Permission, PermissionT, RoleType, RoleTypes, UUID} from '@melluin/common';
import {CurrentUserService} from '@fe/app/auth/service/current-user.service';

@Injectable({providedIn: 'root'})
export class PermissionService {

    private readonly currentUserService = inject(CurrentUserService);

    private readonly currentUser = this.currentUserService.currentUser;
    private readonly permissionInfo = computed(() => this.calculatePermissionInfo(this.currentUser()?.permissions ?? []));

    public has(permission: PermissionT): boolean {
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
            [Permission.canWriteVisitor]: [RoleTypes.VISITOR, RoleTypes.INTERN],
            [Permission.canWriteCoordinator]: [RoleTypes.COORDINATOR],
            [Permission.canWriteAdmin]: [RoleTypes.ADMINISTRATOR],
            [Permission.canWriteSysAdmin]: [RoleTypes.SYSADMIN]
        }
        return this.listPermissions()
            .map(p => permissionToRolesMap[p])
            .filter(r => isNotNil(r))
            .flat();
    }

    private calculatePermissionInfo(permissions: Array<PermissionT>): Record<PermissionT, boolean> {
        return Object.values(Permission).reduce<Record<PermissionT, boolean>>(
            (result, current) => {
                result[current] = permissions.includes(current);
                return result;
            },
            {} as Record<PermissionT, boolean>
        );
    }

    private listPermissions(): Array<PermissionT> {
        return Object.values(Permission).filter(p => this.has(p));
    }

}
