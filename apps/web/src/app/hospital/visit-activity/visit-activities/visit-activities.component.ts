import {Component, inject, input, OnInit} from '@angular/core';
import {VisitActivityService} from '@fe/app/hospital/visit-activity/visit-activity.service';
import {
    Visit,
    VisitActivity,
    VisitActivityInfo,
    VisitStatus,
    isNil,
    isNilOrEmpty,
    Permission,
    VisitedChild,
    WrappedVisitActivity
} from '@melluin/common';
import {firstValueFrom} from 'rxjs';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {
    convertToChildrenById,
    VisitedChildById
} from '@fe/app/hospital/visit-activity-filler/model/visited-child-by-id';

@Component({
    selector: 'app-visit-activities',
    templateUrl: './visit-activities.component.html',
    styleUrls: ['./visit-activities.component.scss']
})
export class VisitActivitiesComponent implements OnInit {

    protected readonly permissions = inject(PermissionService);
    private readonly activityService = inject(VisitActivityService);

    Permission = Permission;

    private readonly statusesWhenActivitiesMeansFail = [
        VisitStatus.DRAFT,
        VisitStatus.SCHEDULED,
        VisitStatus.CANCELED,
        VisitStatus.FAILED_BECAUSE_NO_CHILD,
        VisitStatus.FAILED_FOR_OTHER_REASON
    ];

    private readonly statusesWhenActivitiesShouldBeShowed = [
        VisitStatus.STARTED,
        VisitStatus.ACTIVITIES_FILLED_OUT,
        VisitStatus.ALL_FILLED_OUT,
        VisitStatus.SUCCESSFUL
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
            && this.visit().status === VisitStatus.STARTED;
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
