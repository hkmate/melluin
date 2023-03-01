import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VisitActivityService} from '@fe/app/hospital/visit-activity/visit-activity.service';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {DepartmentBoxStatus} from '@shared/department/box/department-box-status';
import {PatientChild} from '@shared/child/patient-child';
import {WrappedHospitalVisitActivity} from '@shared/hospital-visit-activity/wrapped-hospital-visit-activity';
import {isNil} from '@shared/util/util';

@Component({
    selector: 'app-visit-activities',
    templateUrl: './visit-activities.component.html',
    styleUrls: ['./visit-activities.component.scss']
})
export class VisitActivitiesComponent implements OnInit {

    @Input()
    public visit: HospitalVisit;

    @Output()
    public visitStatusChanged = new EventEmitter<HospitalVisitStatus>();

    protected children: Array<PatientChild> = [];
    protected activities: Array<HospitalVisitActivity> = [];
    protected visitDate: Date;
    protected boxInfoList: Array<DepartmentBoxStatus> = [];
    protected editEnabled = false;

    constructor(private readonly activityService: VisitActivityService) {
    }

    public ngOnInit(): void {
        this.visitDate = new Date(this.visit.dateTimeFrom);
        this.setEditEnable();
        this.activityService.getActivities(this.visit.id).subscribe(wrapped => {
            if (isNil(wrapped)) {
                return;
            }
            this.children = this.createPatientInfo(wrapped);
            this.activities = wrapped.activities;
        });
    }

    protected boxStatusAdded(newBoxStatus: DepartmentBoxStatus): void {
        this.boxInfoList.push(newBoxStatus);
    }

    private setEditEnable(): void {
        this.editEnabled = (HospitalVisitStatus.SCHEDULED === this.visit.status);
    }

    private createPatientInfo(activityInfo: WrappedHospitalVisitActivity): Array<PatientChild> {
        const childrenById = activityInfo.children.reduce<Record<string, PatientChild>>((result, child) => {
            result[child.id] = {child};
            return result;
        }, {});
        activityInfo.activities.forEach(activityInfo =>
            activityInfo.children.forEach(child => {
                childrenById[child.childId].isParentThere = child.isParentThere;
            }));
        return Object.values(childrenById);
    }

}
