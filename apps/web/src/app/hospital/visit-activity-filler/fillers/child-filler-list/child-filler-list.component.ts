import {Component, inject} from '@angular/core';
import {VisitActivityFillerService} from '@fe/app/hospital/visit-activity-filler/visit-activity-filler.service';
import {Observable} from 'rxjs';
import {isNotNil, Permission, VisitedChild} from '@melluin/common';
import {PermissionService} from '@fe/app/auth/service/permission.service';

@Component({
    selector: 'app-child-filler-list',
    templateUrl: './child-filler-list.component.html',
    styleUrls: ['./child-filler-list.component.scss']
})
export class ChildFillerListComponent {

    protected readonly permissions = inject(PermissionService);
    private readonly filler = inject(VisitActivityFillerService);

    protected readonly Permission = Permission;

    protected children$: Observable<Array<VisitedChild>>;
    protected creatingInProcess = false;

    constructor() {
        this.children$ = this.filler.getChildren();
    }

    protected creatorToggled(value?: boolean): void {
        this.creatingInProcess = isNotNil(value) ? value : !this.creatingInProcess;
    }

}
