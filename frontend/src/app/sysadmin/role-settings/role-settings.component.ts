import {Component, OnInit} from '@angular/core';
import {AppTitle} from '@fe/app/app-title.service';
import {Role, RolePermission} from '@shared/user/role.enum';
import {RoleService} from '@fe/app/sysadmin/role-settings/role.service';
import {Permission} from '@shared/user/permission.enum';
import {TableDataSource} from '@fe/app/util/table-data-source';
import {isNil} from '@shared/util/util';

interface PermissionEdit {
    permissions: Array<Permission>;
    loading: boolean;
}

@Component({
    selector: 'app-role-settings',
    templateUrl: './role-settings.component.html',
    styleUrls: ['./role-settings.component.scss']
})
export class RoleSettingsComponent implements OnInit {

    protected permissionOptions = Object.values(Permission);
    protected tableHeaders = ['name', 'permissions', 'options'];
    protected rolesTableDataSource = new TableDataSource<RolePermission>();
    protected editions: Partial<Record<Role, PermissionEdit>> = {};
    protected originalRoles: Array<RolePermission>;

    constructor(private readonly title: AppTitle,
                private readonly roleService: RoleService) {
    }

    public ngOnInit(): void {
        this.title.setTitleByI18n('Sysadmin.RoleSettings.Title');
        this.initRoles();
    }

    public changeToEdit(rolePermission: RolePermission): void {
        this.editions[rolePermission.role] = {
            permissions: rolePermission.permissions,
            loading: false
        };
    }

    protected save(rolePermission: RolePermission, permissions: Array<Permission>): void {
        this.setLoading(rolePermission.role, true);
        this.roleService.update({...rolePermission, permissions}).subscribe({
            next: (newRolePermissions: RolePermission) => {
                this.changeRoleInOriginal(newRolePermissions);
                this.rolesTableDataSource.emit(this.originalRoles);
                this.closeEdition(rolePermission.role);
            },
            error: () => {
                this.closeEdition(rolePermission.role);
            }
        });
    }

    protected cancelEditing(rolePermission: RolePermission): void {
        this.closeEdition(rolePermission.role);
    }

    private initRoles(): void {
        this.roleService.getAll().subscribe(value => {
            this.originalRoles = value;
            this.rolesTableDataSource.emit(value);
        });
    }

    private changeRoleInOriginal(rolePermission: RolePermission): void {
        this.originalRoles = this.originalRoles.map(value => {
            if (value.role === rolePermission.role) {
                return rolePermission;
            }
            return value;
        });
    }

    private setLoading(role: Role, loading: boolean): void {
        const edit = this.editions[role];
        if (isNil(edit)) {
            return;
        }
        edit.loading = loading;
    }

    private closeEdition(role: Role): void {
        this.editions[role] = undefined;
    }

}
