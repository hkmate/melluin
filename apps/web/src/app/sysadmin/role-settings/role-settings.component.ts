import {Component, inject, signal} from '@angular/core';
import {AppTitle} from '@fe/app/app-title.service';
import {RoleService} from '@fe/app/sysadmin/role-settings/role.service';
import {Permission} from '@shared/user/permission.enum';
import {isNil, isNotNil, NOOP} from '@shared/util/util';
import {Role, RoleType} from '@shared/user/role';
import {ConfirmationService} from '@fe/app/confirmation/confirmation.service';
import {TranslateService} from '@ngx-translate/core';

type RoleEdit = Role & {
    loading: boolean;
}

@Component({
    selector: 'app-role-settings',
    templateUrl: './role-settings.component.html',
    styleUrls: ['./role-settings.component.scss']
})
export class RoleSettingsComponent {

    private readonly title = inject(AppTitle);
    private readonly translate = inject(TranslateService);
    private readonly confirm = inject(ConfirmationService);
    private readonly roleService = inject(RoleService);

    protected readonly roleTypeOptions = Object.values(RoleType);
    protected readonly permissionOptions = Object.values(Permission);
    protected readonly tableHeaders = ['name', 'type', 'permissions', 'options'];

    protected items = signal<Array<Role>>([]);
    protected editions: Partial<Record<string, RoleEdit>> = {};
    protected originalRoles: Array<Role>;
    protected creation = false;

    constructor() {
        this.title.setTitleByI18n('Sysadmin.RoleSettings.Title');
        this.initRoles();
    }

    public changeToEdit(role: Role): void {
        this.editions[role.id] = {
            ...role,
            permissions: [...role.permissions],
            loading: false
        };
    }

    protected save(role: Role, {loading, ...roleChanges}: RoleEdit): void {
        this.setLoading(role.id, true);
        this.roleService.update({...role, ...roleChanges}).subscribe({
            next: (newRole: Role) => {
                this.changeRoleInOriginal(newRole);
                this.items.set(this.originalRoles);
                this.closeEdition(role.id);
            },
            error: () => {
                this.closeEdition(role.id);
            }
        });
    }

    protected cancelEditing(role: Role): void {
        this.closeEdition(role.id);
    }

    protected deleteRole(role: Role): void {
        const msg = this.translate.instant('Sysadmin.RoleSettings.DeleteRole', {roleName: role.name});
        this.confirm.getConfirm({message: msg}).then(() => {
            this.roleService.delete(role.id).subscribe(() => {
                this.initRoles();
            })
        }).catch(NOOP);
    }

    protected openCreation(): void {
        this.creation = true;
    }

    protected closeCreation(newRole: Role | undefined): void {
        if (isNotNil(newRole)) {
            this.originalRoles.push(newRole);
            this.items.set(this.originalRoles);
        }
        this.creation = false;
    }

    private initRoles(): void {
        this.roleService.getAll().subscribe(value => {
            this.originalRoles = value;
            this.items.set(value);
        });
    }

    private changeRoleInOriginal(role: Role): void {
        this.originalRoles = this.originalRoles.map(value => {
            if (value.id === role.id || isNil(value.id)) {
                return role;
            }
            return value;
        });
    }

    private setLoading(roleId: string, loading: boolean): void {
        const edit = this.editions[roleId];
        if (isNil(edit)) {
            return;
        }
        edit.loading = loading;
    }

    private closeEdition(roleId: string): void {
        this.editions[roleId] = undefined;
    }

}
