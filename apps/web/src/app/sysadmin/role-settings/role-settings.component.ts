import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {AppTitle} from '@fe/app/app-title.service';
import {RoleService} from '@fe/app/sysadmin/role-settings/role.service';
import {isNil, NOOP, Role} from '@melluin/common';
import {ConfirmationService} from '@fe/app/confirmation/confirmation.service';
import {TranslatePipe} from '@ngx-translate/core';
import {MatIconButton, MatMiniFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {RoleEditorComponent} from '@fe/app/sysadmin/role-settings/role-create/role-editor.component';
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable
} from '@angular/material/table';
import {t} from '@fe/app/util/translate/translate';

@Component({
    imports: [
        TranslatePipe,
        MatMiniFabButton,
        MatIcon,
        RoleEditorComponent,
        MatTable,
        MatColumnDef,
        MatHeaderCell,
        MatHeaderCellDef,
        MatCellDef,
        MatCell,
        MatIconButton,
        MatHeaderRow,
        MatRow,
        MatRowDef,
        MatHeaderRowDef
    ],
    providers: [RoleService],
    selector: 'app-role-settings',
    templateUrl: './role-settings.component.html',
    styleUrls: ['./role-settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleSettingsComponent {

    protected readonly tableHeaders = ['name', 'type', 'permissions', 'options'];

    private readonly title = inject(AppTitle);
    private readonly confirm = inject(ConfirmationService);
    private readonly roleService = inject(RoleService);

    protected readonly items = signal<Array<Role>>([]);
    protected readonly editedItem = signal<Role | undefined>(undefined);
    protected readonly creation = signal(false);

    constructor() {
        this.title.setTitleByI18n('Sysadmin.RoleSettings.Title');
        this.initRoles();
    }

    public openEditor(role: Role): void {
        this.editedItem.set(role);
    }

    protected handleSuccessfulEdit(role: Role): void {
        this.changeRoleInList(role);
        this.closeEditor();
    }

    protected closeEditor(): void {
        this.editedItem.set(undefined);
    }

    protected deleteRole(role: Role): void {
        const msg = t('Sysadmin.RoleSettings.DeleteRole', {roleName: role.name});
        this.confirm.getConfirm({message: msg}).then(() => {
            this.roleService.delete(role.id).subscribe(() => {
                this.initRoles();
            })
        }).catch(NOOP);
    }

    protected openCreation(): void {
        this.creation.set(true);
    }

    protected addNewRole(newRole: Role): void {
        this.items.update(items => [...items, newRole]);
        this.closeCreation();
    }

    protected closeCreation(): void {
        this.creation.set(false);
    }

    private initRoles(): void {
        this.roleService.getAll().subscribe(value => {
            this.items.set(value);
        });
    }

    private changeRoleInList(role: Role): void {
        this.items.update(items => items.map(value => {
            if (value.id === role.id || isNil(value.id)) {
                return role;
            }
            return value;
        }));
    }

}
