import {Component, Input, OnInit} from '@angular/core';
import {VisitActivityService} from '@fe/app/hospital/visit-activity/visit-activity.service';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';
import {DepartmentBoxStatus} from '@shared/department/box/department-box-status';
import {PatientChild} from '@shared/child/patient-child';
import {WrappedHospitalVisitActivity} from '@shared/hospital-visit-activity/wrapped-hospital-visit-activity';
import {isNil, isNotNil} from '@shared/util/util';
import {firstValueFrom} from 'rxjs';
import {Permission} from '@shared/user/permission.enum';
import {PermissionService} from '@fe/app/auth/service/permission.service';

@Component({
    selector: 'app-visit-activities',
    templateUrl: './visit-activities.component.html',
    styleUrls: ['./visit-activities.component.scss']
})
export class VisitActivitiesComponent implements OnInit {

    Permission = Permission;

    @Input()
    public visit: HospitalVisit;

    @Input()
    public wrappedActivities?: WrappedHospitalVisitActivity;

    @Input()
    public editEnabled = false;

    protected children: Array<PatientChild> = [];
    protected activities: Array<HospitalVisitActivity> = [];
    protected visitDate: Date;
    protected boxInfoList: Array<DepartmentBoxStatus> = [];

    constructor(protected readonly permissions: PermissionService,
                private readonly activityService: VisitActivityService) {
    }

    public ngOnInit(): void {
        this.visitDate = new Date(this.visit.dateTimeFrom);
        this.setupActivities().then();
    }

    protected boxStatusAdded(newBoxStatus: DepartmentBoxStatus): void {
        this.boxInfoList.push(newBoxStatus);
    }

    protected childrenListChanged(children: Array<PatientChild>): void {
        this.children = [...children];
    }

    private async setupActivities(): Promise<void> {
        const wrapped = await this.getWrappedActivities();
        if (isNil(wrapped)) {
            return;
        }
        this.children = this.createPatientInfo(wrapped);
        this.activities = wrapped.activities;
    }

    private getWrappedActivities(): Promise<WrappedHospitalVisitActivity> {
        if (isNotNil(this.wrappedActivities)) {
            return Promise.resolve(this.wrappedActivities);
        }
        return firstValueFrom(this.activityService.getActivities(this.visit.id));
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
