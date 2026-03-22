import {ChangeDetectionStrategy, Component, computed, effect, inject, input, signal} from '@angular/core';
import {VisitActivityService} from '@fe/app/hospital/visit-activity/visit-activity.service';
import {
    isNil,
    isNilOrEmpty,
    Permission,
    Visit,
    VisitActivity,
    VisitActivityInfo,
    VisitedChild,
    VisitStatus,
    VisitStatuses,
    WrappedVisitActivity
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

const statusesWhenActivitiesMeansFail: Array<VisitStatus> = [
    VisitStatuses.DRAFT,
    VisitStatuses.SCHEDULED,
    VisitStatuses.CANCELED,
    VisitStatuses.FAILED_BECAUSE_NO_CHILD,
    VisitStatuses.FAILED_FOR_OTHER_REASON
];

const statusesWhenActivitiesShouldBeShowed: Array<VisitStatus> = [
    VisitStatuses.STARTED,
    VisitStatuses.ACTIVITIES_FILLED_OUT,
    VisitStatuses.ALL_FILLED_OUT,
    VisitStatuses.SUCCESSFUL
];

@Component({
    imports: [
        TranslatePipe,
        ChildrenListComponent,
        VisitActivitiesListComponent,
        VisitActivityInformationComponent,
        BoxInfoListByVisitComponent
    ],
    selector: 'app-visit-activities',
    templateUrl: './visit-activities.component.html',
    styleUrls: ['./visit-activities.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisitActivitiesComponent {

    protected readonly Permission = Permission;

    protected readonly permissions = inject(PermissionService);
    private readonly activityService = inject(VisitActivityService);

    public readonly visit = input.required<Visit>();
    public readonly needWarnings = input.required<boolean>();

    protected readonly children = signal<Array<VisitedChild>>([]);
    protected readonly activities = signal<Array<VisitActivity>>([]);
    protected readonly information = signal<VisitActivityInfo | undefined>(undefined);
    protected readonly visitDate = computed(() => new Date(this.visit().dateTimeFrom));
    protected readonly childrenById = signal<VisitedChildById>({});

    protected readonly needWarningOnActivitiesWhenStarted = computed(() => (
        this.needWarnings() && this.visit().status === VisitStatuses.STARTED
    ));

    protected readonly needWarningOnActivitiesWhenFailed = computed(() => (
        this.needWarnings()
        && statusesWhenActivitiesMeansFail.includes(this.visit().status)
        && !this.isDataEmpty()
    ));

    protected readonly isDataShouldPresent = computed(() => (
        !this.isDataEmpty() || statusesWhenActivitiesShouldBeShowed.includes(this.visit().status)
    ));

    constructor() {
        effect(() => this.setupActivities());
    }

    protected getStyleNgClasses(): Record<string, boolean> {
        return {
            'activities-info': true,
            [this.visit().status]: this.needWarnings()
        };
    }

    private isDataEmpty(): boolean {
        return isNilOrEmpty(this.children()) && isNilOrEmpty(this.activities());
    }

    private async setupActivities(): Promise<void> {
        const wrapped = await this.getWrappedActivities();
        if (isNil(wrapped)) {
            return;
        }
        this.children.set(wrapped.children);
        this.activities.set(wrapped.activities);
        this.childrenById.set(convertToChildrenById(wrapped.children));
        this.information.set(wrapped.info);
    }

    private getWrappedActivities(): Promise<WrappedVisitActivity> {
        return firstValueFrom(this.activityService.getActivities(this.visit().id));
    }

}
