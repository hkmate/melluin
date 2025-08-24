import {Component, Input, OnInit} from '@angular/core';
import {VisitActivityService} from '@fe/app/hospital/visit-activity/visit-activity.service';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';
import {WrappedHospitalVisitActivity} from '@shared/hospital-visit-activity/wrapped-hospital-visit-activity';
import {isNil, isNilOrEmpty} from '@shared/util/util';
import {firstValueFrom} from 'rxjs';
import {Permission} from '@shared/user/permission.enum';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {VisitedChild} from '@shared/hospital-visit/visited-child';
import {
    convertToChildrenById,
    VisitedChildById
} from '@fe/app/hospital/hospital-visit-activity-filler/model/visited-child-by-id';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {HospitalVisitActivityInfo} from '@shared/hospital-visit-activity/hospital-visit-activity-info';

@Component({
    selector: 'app-visit-activities',
    templateUrl: './visit-activities.component.html',
    styleUrls: ['./visit-activities.component.scss']
})
export class VisitActivitiesComponent implements OnInit {

    Permission = Permission;
    HospitalVisitStatus = HospitalVisitStatus;

    private readonly statusesWhenActivitiesMeansFail = [
        HospitalVisitStatus.DRAFT,
        HospitalVisitStatus.SCHEDULED,
        HospitalVisitStatus.CANCELED,
        HospitalVisitStatus.FAILED_BECAUSE_NO_CHILD,
        HospitalVisitStatus.FAILED_FOR_OTHER_REASON
    ];

    private readonly statusesWhenActivitiesShouldBeShowed = [
        HospitalVisitStatus.STARTED,
        HospitalVisitStatus.ACTIVITIES_FILLED_OUT,
        HospitalVisitStatus.ALL_FILLED_OUT,
        HospitalVisitStatus.SUCCESSFUL
    ];

    @Input()
    public visit: HospitalVisit;

    @Input()
    public needWarnings: boolean;

    protected children: Array<VisitedChild> = [];
    protected activities: Array<HospitalVisitActivity> = [];
    protected information?: HospitalVisitActivityInfo = undefined;
    protected visitDate: Date;
    protected childrenById: VisitedChildById;

    constructor(protected readonly permissions: PermissionService,
                private readonly activityService: VisitActivityService) {
    }

    public ngOnInit(): void {
        this.visitDate = new Date(this.visit.dateTimeFrom);
        this.setupActivities().then();
    }

    protected needWarningOnActivitiesWhenStarted(): boolean {
        return this.needWarnings
            && this.visit.status === HospitalVisitStatus.STARTED;
    }

    protected needWarningOnActivitiesWhenFailed(): boolean {
        return this.needWarnings
            && this.statusesWhenActivitiesMeansFail.includes(this.visit.status)
            && !this.isDataEmpty();
    }

    protected isDataShouldPresent(): boolean {
        return !this.isDataEmpty() || this.statusesWhenActivitiesShouldBeShowed.includes(this.visit.status);
    }

    protected isDataEmpty(): boolean {
        return isNilOrEmpty(this.children) && isNilOrEmpty(this.activities);
    }

    protected getStyleNgClasses(): Record<string, boolean> {
        return {
            'activities-info': true,
            [this.visit.status]: this.needWarnings
        };
    }

    private async setupActivities(): Promise<void> {
        const wrapped = await this.getWrappedActivities();
        if (isNil(wrapped)) {
            return;
        }
        this.children = wrapped.children;
        this.activities = wrapped.activities;
        this.childrenById = convertToChildrenById(this.children);
        this.information = wrapped.info;
    }

    private getWrappedActivities(): Promise<WrappedHospitalVisitActivity> {
        return firstValueFrom(this.activityService.getActivities(this.visit.id));
    }

}
