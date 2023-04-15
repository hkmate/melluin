import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DepartmentBoxService} from '@fe/app/hospital/department-box/department-box.service';
import {DepartmentBoxStatusReport} from '@shared/department/box/department-box-status-report';
import {DepartmentBoxStatus} from '@shared/department/box/department-box-status';
import {MessageService} from '@fe/app/util/message.service';

@Component({
    selector: 'app-optional-box-info-creator',
    templateUrl: './optional-box-info-creator.component.html',
    styleUrls: ['./optional-box-info-creator.component.scss']
})
export class OptionalBoxInfoCreatorComponent {

    @Input()
    public departmentId: string;

    @Input()
    public visitId: string;

    @Output()
    public itemAdded = new EventEmitter<DepartmentBoxStatus>();

    protected creatingInProcess = false;
    protected saveInProcess = false;

    constructor(private readonly msg: MessageService,
                private readonly boxStatusService: DepartmentBoxService) {
    }

    protected creatorToggled(): void {
        this.creatingInProcess = !this.creatingInProcess;
    }

    protected createCanceled(): void {
        this.creatingInProcess = false;
    }

    protected createFinished(objectToSave: DepartmentBoxStatusReport): void {
        objectToSave.visitId = this.visitId;
        this.saveInProcess = true;
        this.boxStatusService.addBoxStatus(this.departmentId, objectToSave).subscribe(newStatus => {
            this.creatingInProcess = false;
            this.saveInProcess = false;
            this.msg.success('SaveSuccessful');
            this.itemAdded.emit(newStatus);
        });
    }

}
