import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PatientChild} from '@shared/child/patient-child';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';
import {VisitActivityService} from '@fe/app/hospital/visit-activity/visit-activity.service';
import {HospitalVisitActivityInput} from '@shared/hospital-visit-activity/hospital-visit-activity-input';
import {MessageService} from '@fe/app/util/message.service';

@Component({
    selector: 'app-visit-activity-manager',
    templateUrl: './visit-activity-manager.component.html',
    styleUrls: ['./visit-activity-manager.component.scss']
})
export class VisitActivityManagerComponent {

    @Input()
    public visitId: string;

    @Input()
    public editEnabled: boolean;

    @Input()
    public activities: Array<HospitalVisitActivity>;

    @Output()
    public activitiesChange = new EventEmitter<Array<HospitalVisitActivity>>();

    protected childrenById: Record<string, PatientChild>;
    protected childrenList: Array<PatientChild>;
    protected creatingInProcess = false;
    protected saveInProcess = false;

    constructor(private readonly msg: MessageService,
                private readonly activityService: VisitActivityService) {
    }

    @Input()
    public set children(children: Array<PatientChild>) {
        this.childrenList = children;
        this.setUpChildrenById();
    }

    protected creatorToggled(): void {
        this.creatingInProcess = !this.creatingInProcess;
    }

    protected createCanceled(): void {
        this.creatingInProcess = false;
    }

    protected createFinished(objectToSave: HospitalVisitActivityInput): void {
        this.saveInProcess = true;
        this.activityService.add(this.visitId, objectToSave).subscribe({
            next: saved => {
                this.msg.success('SaveSuccessful');
                this.activities.push(saved);
                this.activitiesChange.emit(this.activities);
                this.creatingInProcess = false;
                this.saveInProcess = false;
            },
            error: () => {
                this.creatingInProcess = false;
                this.saveInProcess = false;
            }
        });
    }

    private setUpChildrenById(): void {
        this.childrenById = this.childrenList.reduce<Record<string, PatientChild>>(
            (result, patientInfo) => {
                result[patientInfo.child.id] = patientInfo;
                return result;
            }, {});
    }

}
