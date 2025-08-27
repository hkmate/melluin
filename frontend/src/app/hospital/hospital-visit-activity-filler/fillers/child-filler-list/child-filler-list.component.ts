import {Component, inject} from '@angular/core';
import {HospitalVisitActivityFillerService} from '@fe/app/hospital/hospital-visit-activity-filler/hospital-visit-activity-filler.service';
import {Observable} from 'rxjs';
import {VisitedChild} from '@shared/hospital-visit/visited-child';
import {Permission} from '@shared/user/permission.enum';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {isNotNil} from '@shared/util/util';

@Component({
    selector: 'app-child-filler-list',
    templateUrl: './child-filler-list.component.html',
    styleUrls: ['./child-filler-list.component.scss']
})
export class ChildFillerListComponent {

    protected readonly permissions = inject(PermissionService);
    private readonly filler = inject(HospitalVisitActivityFillerService);

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
