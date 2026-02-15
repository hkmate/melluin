import {Component, computed, effect, inject, input, signal} from '@angular/core';
import {
    HospitalVisitActivity,
    HospitalVisitActivityInfo,
    isNilOrEmpty,
    Permission,
    VisitedChild,
    WrappedHospitalVisitActivity
} from '@melluin/common';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {convertToChildrenById} from '@fe/app/hospital/hospital-visit-activity-filler/model/visited-child-by-id';

@Component({
    selector: 'app-related-visit',
    templateUrl: './related-visit.component.html',
    styleUrls: ['./related-visit.component.scss']
})
export class RelatedVisitComponent {

    protected readonly permissions = inject(PermissionService);

    Permission = Permission;

    public readonly wrappedActivity = input.required<WrappedHospitalVisitActivity>();

    protected children: Array<VisitedChild> = [];
    protected childrenById: Record<string, VisitedChild>;
    protected activities: Array<HospitalVisitActivity> = [];
    protected information = signal<HospitalVisitActivityInfo | undefined>(undefined);
    protected infoIsEmpty = computed(() => isNilOrEmpty(this.information()?.content));
    protected visitDate: Date;

    constructor() {
        effect(() => {
            this.visitDate = new Date(this.wrappedActivity().hospitalVisit.dateTimeFrom);
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
