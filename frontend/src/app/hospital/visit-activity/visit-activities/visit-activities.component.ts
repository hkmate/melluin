import {Component, Input, OnInit} from '@angular/core';
import {VisitActivityService} from '@fe/app/hospital/visit-activity/visit-activity.service';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';
import {DepartmentBoxStatus} from '@shared/department/box/department-box-status';
import {WrappedHospitalVisitActivity} from '@shared/hospital-visit-activity/wrapped-hospital-visit-activity';
import {isNil} from '@shared/util/util';
import {firstValueFrom} from 'rxjs';
import {Permission} from '@shared/user/permission.enum';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {DepartmentBoxService} from '@fe/app/hospital/department-box/department-box.service';
import {VisitedChild} from '@shared/hospital-visit/visited-child';
import {
    convertToChildrenById,
    VisitedChildById
} from '@fe/app/hospital/hospital-visit-activity-filler/model/visited-child-by-id';

@Component({
    selector: 'app-visit-activities',
    templateUrl: './visit-activities.component.html',
    styleUrls: ['./visit-activities.component.scss']
})
export class VisitActivitiesComponent implements OnInit {

    Permission = Permission;

    @Input()
    public visit: HospitalVisit;

    protected children: Array<VisitedChild> = [];
    protected activities: Array<HospitalVisitActivity> = [];
    protected visitDate: Date;
    protected boxInfoList: Array<DepartmentBoxStatus> = [];
    protected childrenById: VisitedChildById;

    constructor(protected readonly permissions: PermissionService,
                private readonly boxService: DepartmentBoxService,
                private readonly activityService: VisitActivityService) {
    }

    public ngOnInit(): void {
        this.visitDate = new Date(this.visit.dateTimeFrom);
        this.setupBoxInfo().then();
        this.setupActivities().then();
    }

    protected boxStatusAdded(newBoxStatus: DepartmentBoxStatus): void {
        this.boxInfoList.push(newBoxStatus);
    }

    private async setupActivities(): Promise<void> {
        const wrapped = await this.getWrappedActivities();
        if (isNil(wrapped)) {
            return;
        }
        this.children = wrapped.children;
        this.activities = wrapped.activities;
        this.childrenById = convertToChildrenById(this.children);
    }

    private getWrappedActivities(): Promise<WrappedHospitalVisitActivity> {
        return firstValueFrom(this.activityService.getActivities(this.visit.id));
    }

    private async setupBoxInfo(): Promise<void> {
        this.boxInfoList = await firstValueFrom(this.boxService.findBoxStatusesByVisit(this.visit.id));
    }

}
