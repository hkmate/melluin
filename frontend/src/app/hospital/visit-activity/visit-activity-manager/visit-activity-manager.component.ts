import {Component, EventEmitter, Input, Output} from '@angular/core';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';
import {VisitActivityService} from '@fe/app/hospital/visit-activity/visit-activity.service';
import {HospitalVisitActivityInput} from '@shared/hospital-visit-activity/hospital-visit-activity-input';
import {MessageService} from '@fe/app/util/message.service';
import {VisitedChild} from '@shared/hospital-visit/visited-child';

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

    protected childrenById: Record<string, VisitedChild>;
    protected childrenList: Array<VisitedChild>;
    protected creatingInProcess = false;
    protected saveInProcess = false;

    constructor(private readonly msg: MessageService,
                private readonly activityService: VisitActivityService) {
    }

    @Input()
    public set children(children: Array<VisitedChild>) {
        this.childrenList = children;
        this.setUpChildrenById();
    }

    protected creatorToggled(): void {
        this.creatingInProcess = !this.creatingInProcess;
    }

    protected createCanceled(): void {
        this.creatingInProcess = false;
    }

    // eslint-disable-next-line max-lines-per-function
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
        this.childrenById = this.childrenList.reduce<Record<string, VisitedChild>>(
            (result, visitedChild) => {
                result[visitedChild.id] = visitedChild;
                return result;
            }, {});
    }

}
