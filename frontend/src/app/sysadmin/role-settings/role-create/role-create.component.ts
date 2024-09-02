import {Component, EventEmitter, Output} from '@angular/core';
import {Role, RoleCreation, RoleType} from '@shared/user/role';
import {Permission} from '@shared/user/permission.enum';
import {RoleService} from '@fe/app/sysadmin/role-settings/role.service';
import {MessageService} from '@fe/app/util/message.service';

@Component({
    selector: 'app-role-create',
    templateUrl: './role-create.component.html',
    styleUrl: './role-create.component.scss'
})
export class RoleCreateComponent {

    protected readonly roleTypeOptions = Object.values(RoleType);
    protected readonly permissionOptions = Object.values(Permission);

    @Output() done = new EventEmitter<Role | undefined>();

    protected newRole: RoleCreation = {name: '', type: RoleType.INTERN, permissions: []};
    protected loading = false;

    constructor(private readonly msg: MessageService,
                private readonly roleService: RoleService) {
    }

    protected save(): void {
        this.loading = true;
        this.roleService.create(this.newRole).subscribe({
            next: value => {
                this.done.emit(value);
                this.loading = false;
            }, error: err => {
                this.msg.errorRaw(err?.message);
                this.done.emit();
            }
        });
    }

    protected cancel(): void {
        this.done.emit();
    }

}
