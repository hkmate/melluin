import {Component} from '@angular/core';
import {VisitedChild} from '@shared/hospital-visit/visited-child';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {HospitalVisitActivityFillerService} from '@fe/app/hospital/hospital-visit-activity-filler/hospital-visit-activity-filler.service';
import {isNotNil} from '@shared/util/util';
import {Permission} from '@shared/user/permission.enum';
import {
    convertToChildrenById,
    VisitedChildById
} from '@fe/app/hospital/hospital-visit-activity-filler/model/visited-child-by-id';
import {AutoUnSubscriberComponent} from '@fe/app/util/auto-unsubscriber.component';
import {Observable} from 'rxjs';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';

@Component({
    selector: 'app-activity-filler-list',
    templateUrl: './activity-filler-list.component.html',
    styleUrls: ['./activity-filler-list.component.scss']
})
export class ActivityFillerListComponent extends AutoUnSubscriberComponent {

    protected readonly Permission = Permission;

    protected activities$: Observable<Array<HospitalVisitActivity>>;
    protected childrenById: VisitedChildById;
    protected creatingInProcess = false;

    constructor(protected readonly permissions: PermissionService,
                private readonly filler: HospitalVisitActivityFillerService) {
        super();
    }

    public ngOnInit(): void {
        this.activities$ = this.filler.getActivities();
        this.addSubscription(this.filler.getChildren(), (children: Array<VisitedChild>) => {
            this.childrenById = convertToChildrenById(children);
        });
    }

    protected toggleCreator(value?: boolean): void {
        this.creatingInProcess = isNotNil(value) ? value : !this.creatingInProcess;
    }

}
