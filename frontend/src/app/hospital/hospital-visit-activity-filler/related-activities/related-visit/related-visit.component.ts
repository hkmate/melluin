import {Component, Input} from '@angular/core';
import {WrappedHospitalVisitActivity} from '@shared/hospital-visit-activity/wrapped-hospital-visit-activity';
import {VisitedChild} from '@shared/hospital-visit/visited-child';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {Permission} from '@shared/user/permission.enum';
import {convertToChildrenById} from '@fe/app/hospital/hospital-visit-activity-filler/model/visited-child-by-id';

@Component({
    selector: 'app-related-visit',
    templateUrl: './related-visit.component.html',
    styleUrls: ['./related-visit.component.scss']
})
export class RelatedVisitComponent {

    Permission = Permission;

    @Input()
    public wrappedActivity: WrappedHospitalVisitActivity;

    protected children: Array<VisitedChild> = [];
    protected childrenById: Record<string, VisitedChild>;
    protected activities: Array<HospitalVisitActivity> = [];
    protected visitDate: Date;

    constructor(protected readonly permissions: PermissionService) {
    }

    public ngOnInit(): void {
        this.visitDate = new Date(this.wrappedActivity.hospitalVisit.dateTimeFrom);
        this.setupActivities()
    }

    private setupActivities(): void {
        this.children = this.wrappedActivity.children;
        this.activities = this.wrappedActivity.activities;
        this.childrenById = convertToChildrenById(this.children);
    }

}
