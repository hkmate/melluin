import {Injectable} from '@angular/core';
import {User} from '@shared/user/user';
import {isNotNil} from '@shared/util/util';
import {Permission} from '@shared/user/permission.enum';
import {cast} from '@shared/util/test-util';
import {Role} from '@shared/user/role.enum';
import {Store} from '@ngrx/store';
import {Actions, ofType} from '@ngrx/effects';
import {selectCurrentUser} from '@fe/app/state/selector/current-user.selector';
import {AppActions} from '@fe/app/state/app-actions';

@Injectable()
export class PermissionService {

    private currentUser?: User;
    private permissionInfo: Record<Permission, boolean>;

    constructor(private readonly store: Store,
                private readonly actions$: Actions) {
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
