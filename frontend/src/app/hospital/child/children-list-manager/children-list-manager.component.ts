import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ChildService} from '@fe/app/hospital/child/child.service';
import {PatientChild, PatientChildInput} from '@shared/child/patient-child';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {Permission} from '@shared/user/permission.enum';
import {MessageService} from '@fe/app/util/message.service';

@Component({
    selector: 'app-children-list-manager',
    templateUrl: './children-list-manager.component.html',
    styleUrls: ['./children-list-manager.component.scss']
})
export class ChildrenListManagerComponent {

    Permission = Permission;

    @Input()
    public visitDate: Date;

    @Input()
    public editEnabled: boolean;

    @Input()
    public needParentInfo: boolean;

    @Input()
    public children: Array<PatientChild>;

    @Output()
    public childrenChange = new EventEmitter<Array<PatientChild>>();

    protected creatingInProcess = false;
    protected saveInProcess = false;

    constructor(protected readonly permissions: PermissionService,
                private readonly msg: MessageService,
                private readonly childService: ChildService) {
    }

    protected creatorToggled(): void {
        this.creatingInProcess = !this.creatingInProcess;
    }

    protected createCanceled(): void {
        this.creatingInProcess = false;
    }

    protected createFinished(objectToSave: PatientChildInput): void {
        this.saveInProcess = true;
        this.childService.add(objectToSave.child).subscribe({
            next: saved => {
                this.msg.success('SaveSuccessful');
                this.children.push({child: saved, isParentThere: objectToSave.isParentThere});
                this.childrenChange.emit(this.children);
                this.creatingInProcess = false;
                this.saveInProcess = false;
            },
            error: () => {
                this.creatingInProcess = false;
                this.saveInProcess = false;
            }
        });
    }

}
