import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {Permission} from '@shared/user/permission.enum';
import {MessageService} from '@fe/app/util/message.service';
import {VisitedChild, VisitedChildInput} from '@shared/hospital-visit/visited-child';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {DateUtil} from '@shared/util/date-util';
import {VisitedChildService} from '@fe/app/hospital/child/visited-child.service';

@Component({
    selector: 'app-children-list-manager',
    templateUrl: './children-list-manager.component.html',
    styleUrls: ['./children-list-manager.component.scss']
})
export class ChildrenListManagerComponent {

    Permission = Permission;

    @Input()
    public editEnabled: boolean;

    @Input()
    public needParentInfo: boolean;

    @Input()
    public children: Array<VisitedChild>;

    @Output()
    public childrenChange = new EventEmitter<Array<VisitedChild>>();

    protected visitDate: Date;
    protected creatingInProcess = false;
    protected saveInProcess = false;
    private hospitalVisit: HospitalVisit;

    constructor(protected readonly permissions: PermissionService,
                private readonly msg: MessageService,
                private readonly visitedChildService: VisitedChildService) {
    }

    @Input()
    public set visit(visit: HospitalVisit) {
        this.hospitalVisit = visit;
        this.visitDate = DateUtil.parse(this.hospitalVisit.dateTimeFrom);
    }

    protected creatorToggled(): void {
        this.creatingInProcess = !this.creatingInProcess;
    }

    protected createCanceled(): void {
        this.creatingInProcess = false;
    }

    // eslint-disable-next-line max-lines-per-function
    protected createFinished(objectToSave: VisitedChildInput): void {
        this.saveInProcess = true;
        this.visitedChildService.add(this.hospitalVisit.id, objectToSave).subscribe({
            next: saved => {
                this.msg.success('SaveSuccessful');
                this.children.push(saved);
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
