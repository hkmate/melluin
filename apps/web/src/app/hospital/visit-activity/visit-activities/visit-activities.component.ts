import {Component, inject, input, OnInit} from '@angular/core';
import {VisitActivityService} from '@fe/app/hospital/visit-activity/visit-activity.service';
import {
    Visit,
    VisitActivity,
    VisitActivityInfo,
    VisitStatuses,
    isNil,
    isNilOrEmpty,
    Permission,
    VisitedChild,
    WrappedVisitActivity, VisitStatus
} from '@melluin/common';
import {firstValueFrom} from 'rxjs';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {
    convertToChildrenById,
    VisitedChildById
} from '@fe/app/hospital/visit-activity-filler/model/visited-child-by-id';
import {TranslatePipe} from '@ngx-translate/core';
import {ChildrenListComponent} from '@fe/app/hospital/child/children-list/children-list.component';
import {VisitActivitiesListComponent} from '@fe/app/hospital/visit-activity/visit-activities-list/visit-activities-list.component';
import {VisitActivityInformationComponent} from '@fe/app/hospital/visit-activity/visit-activity-information/visit-activity-information.component';
import {BoxInfoListByVisitComponent} from '@fe/app/hospital/department-box/department-box-info-list/box-info-list-by-visit.component';

@Component({
    selector: 'app-visit-activities',
    templateUrl: './visit-activities.component.html',
    imports: [
        TranslatePipe,
        ChildrenListComponent,
        VisitActivitiesListComponent,
        VisitActivityInformationComponent,
        BoxInfoListByVisitComponent
    ],
    styleUrls: ['./visit-activities.component.scss']
})
export class VisitActivitiesComponent implements OnInit {

    protected readonly permissions = inject(PermissionService);
    private readonly activityService = inject(VisitActivityService);

    Permission = Permission;

    private readonly statusesWhenActivitiesMeansFail: Array<VisitStatus> = [
        VisitStatuses.DRAFT,
        VisitStatuses.SCHEDULED,
        VisitStatuses.CANCELED,
        VisitStatuses.FAILED_BECAUSE_NO_CHILD,
        VisitStatuses.FAILED_FOR_OTHER_REASON
    ];

    private readonly statusesWhenActivitiesShouldBeShowed: Array<VisitStatus> = [
        VisitStatuses.STARTED,
        VisitStatuses.ACTIVITIES_FILLED_OUT,
        VisitStatuses.ALL_FILLED_OUT,
        VisitStatuses.SUCCESSFUL
    ];

    public readonly visit = input.required<Visit>();
    public readonly needWarnings = input.required<boolean>();

    protected children: Array<VisitedChild> = [];
    protected activities: Array<VisitActivity> = [];
    protected information?: VisitActivityInfo = undefined;
    protected visitDate: Date;
    protected childrenById: VisitedChildById;

    public ngOnInit(): void {
        this.visitDate = new Date(this.visit().dateTimeFrom);
        this.setupActivities().then();
    }

    protected needWarningOnActivitiesWhenStarted(): boolean {
        return this.needWarnings()
            && this.visit().status === VisitStatuses.STARTED;
    }

    protected needWarningOnActivitiesWhenFailed(): boolean {
        return this.needWarnings()
            && this.statusesWhenActivitiesMeansFail.includes(this.visit().status)
            && !this.isDataEmpty();
    }

    protected isDataShouldPresent(): boolean {
        return !this.isDataEmpty() || this.statusesWhenActivitiesShouldBeShowed.includes(this.visit().status);
    }

    protected isDataEmpty(): boolean {
        return isNilOrEmpty(this.children) && isNilOrEmpty(this.activities);
    }

    protected getStyleNgClasses(): Record<string, boolean> {
        return {
            'activities-info': true,
            [this.visit().status]: this.needWarnings()
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

    private getWrappedActivities(): Promise<WrappedVisitActivity> {
        return firstValueFrom(this.activityService.getActivities(this.visit().id));
    }

}
