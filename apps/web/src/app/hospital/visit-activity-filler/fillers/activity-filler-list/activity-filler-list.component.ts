import {Component, inject} from '@angular/core';
import {VisitActivity, isNotNil, Permission, VisitedChild} from '@melluin/common';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {VisitActivityFillerService} from '@fe/app/hospital/visit-activity-filler/visit-activity-filler.service';
import {
    convertToChildrenById,
    VisitedChildById
} from '@fe/app/hospital/visit-activity-filler/model/visited-child-by-id';
import {Observable} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-activity-filler-list',
    templateUrl: './activity-filler-list.component.html',
    styleUrls: ['./activity-filler-list.component.scss']
})
export class ActivityFillerListComponent {

    protected readonly Permission = Permission;

    protected readonly permissions = inject(PermissionService);
    private readonly filler = inject(VisitActivityFillerService);

    protected activities$: Observable<Array<VisitActivity>>;
    protected childrenById: VisitedChildById;
    protected creatingInProcess = false;

    constructor() {
        this.activities$ = this.filler.getActivities();
        this.filler.getChildren().pipe(takeUntilDestroyed()).subscribe((children: Array<VisitedChild>) => {
            this.childrenById = convertToChildrenById(children);
        });
    }

    protected toggleCreator(value?: boolean): void {
        this.creatingInProcess = isNotNil(value) ? value : !this.creatingInProcess;
    }

}
