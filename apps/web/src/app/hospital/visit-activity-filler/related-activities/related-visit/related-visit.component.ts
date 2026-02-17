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

@Component({
    selector: 'app-related-visit',
    templateUrl: './related-visit.component.html',
    styleUrls: ['./related-visit.component.scss']
})
export class RelatedVisitComponent {

    protected readonly permissions = inject(PermissionService);

    Permission = Permission;

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
        }, {allowSignalWrites: true});
    }

    private setupActivities(): void {
        this.children = this.wrappedActivity().children;
        this.activities = this.wrappedActivity().activities;
        this.information.set(this.wrappedActivity().info);
        this.childrenById = convertToChildrenById(this.children);
    }

}
