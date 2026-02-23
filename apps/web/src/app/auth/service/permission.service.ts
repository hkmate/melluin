import {inject, Injectable} from '@angular/core';
import {cast, isNotNil, Permission, RoleType, User} from '@melluin/common';
import {Store} from '@ngrx/store';
import {Actions, ofType} from '@ngrx/effects';
import {selectCurrentUser} from '@fe/app/state/selector/current-user.selector';
import {AppActions} from '@fe/app/state/app-actions';

@Injectable({providedIn: 'root'})
export class PermissionService {

    private readonly store = inject(Store);
    private readonly actions$ = inject(Actions);

    private currentUser?: User;
    private permissionInfo: Record<Permission, boolean>;

    constructor() {
        this.setup();
    }

    public has(permission: Permission): boolean {
        return this.permissionInfo[permission];
    }

    public get userId(): string | undefined {
        return this.currentUser?.id;
    }

    public get personId(): string | undefined {
        return this.currentUser?.personId;
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

    private setup(): void {
        this.store.pipe(selectCurrentUser).subscribe(cu => {
            this.currentUser = cu;
            this.setUpPermissionInfo(this.currentUser.permissions);
        })
        this.actions$.pipe(ofType(AppActions.userLogout)).subscribe(() => {
            this.currentUser = undefined;
            this.setUpPermissionInfo([]);
        });
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
