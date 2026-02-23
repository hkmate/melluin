import {Component, computed, effect, inject, input, signal} from '@angular/core';
import {
    VisitActivity,
    VisitActivityInfo,
    isNilOrEmpty,
    Permission,
    VisitedChild,
    WrappedVisitActivity
} from '@melluin/common';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {convertToChildrenById} from '@fe/app/hospital/visit-activity-filler/model/visited-child-by-id';
import {MatCard, MatCardContent} from '@angular/material/card';
import {TranslatePipe} from '@ngx-translate/core';
import {RelatedVisitChildComponent} from '@fe/app/hospital/visit-activity-filler/related-activities/related-visit-child/related-visit-child.component';
import {RelatedActivityComponent} from '@fe/app/hospital/visit-activity-filler/related-activities/related-activity/related-activity.component';

@Component({
    selector: 'app-related-visit',
    templateUrl: './related-visit.component.html',
    imports: [
        MatCard,
        TranslatePipe,
        MatCardContent,
        RelatedVisitChildComponent,
        RelatedActivityComponent
    ],
    styleUrls: ['./related-visit.component.scss']
})
export class RelatedVisitComponent {

    protected readonly Permission = Permission;

    protected readonly permissions = inject(PermissionService);

    public readonly wrappedActivity = input.required<WrappedVisitActivity>();

    protected children: Array<VisitedChild> = [];
    protected childrenById: Record<string, VisitedChild>;
    protected activities: Array<VisitActivity> = [];
    protected information = signal<VisitActivityInfo | undefined>(undefined);
    protected infoIsEmpty = computed(() => isNilOrEmpty(this.information()?.content));
    protected visitDate: Date;

    constructor() {
        effect(() => {
            this.visitDate = new Date(this.wrappedActivity().visit.dateTimeFrom);
            this.setupActivities();
        });
    }

    private setupActivities(): void {
        this.children = this.wrappedActivity().children;
        this.activities = this.wrappedActivity().activities;
        this.information.set(this.wrappedActivity().info);
        this.childrenById = convertToChildrenById(this.children);
    }

}
