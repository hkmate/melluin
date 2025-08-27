import {Component, computed, effect, inject, input, signal} from '@angular/core';
import {WrappedHospitalVisitActivity} from '@shared/hospital-visit-activity/wrapped-hospital-visit-activity';
import {VisitedChild} from '@shared/hospital-visit/visited-child';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {Permission} from '@shared/user/permission.enum';
import {convertToChildrenById} from '@fe/app/hospital/hospital-visit-activity-filler/model/visited-child-by-id';
import {HospitalVisitActivityInfo} from '@shared/hospital-visit-activity/hospital-visit-activity-info';
import {isNilOrEmpty} from '@shared/util/util';

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
        });
    }

    private setupActivities(): void {
        this.children = this.wrappedActivity().children;
        this.activities = this.wrappedActivity().activities;
        this.information.set(this.wrappedActivity().info);
        this.childrenById = convertToChildrenById(this.children);
    }

}
