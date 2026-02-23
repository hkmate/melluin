import {Component, inject} from '@angular/core';
import {VisitActivityFillerService} from '@fe/app/hospital/visit-activity-filler/visit-activity-filler.service';
import {Observable} from 'rxjs';
import {isNotNil, Permission, VisitedChild} from '@melluin/common';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {TranslatePipe} from '@ngx-translate/core';
import {MatMiniFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {FillerChildCreateComponent} from '@fe/app/hospital/visit-activity-filler/fillers/child-filler-list/filler-child-create/filler-child-create.component';
import {AsyncPipe} from '@angular/common';
import {FillerChildItemComponent} from '@fe/app/hospital/visit-activity-filler/fillers/child-filler-list/filler-child-item/filler-child-item.component';

@Component({
    selector: 'app-child-filler-list',
    templateUrl: './child-filler-list.component.html',
    imports: [
        TranslatePipe,
        MatMiniFabButton,
        MatIcon,
        FillerChildCreateComponent,
        AsyncPipe,
        FillerChildItemComponent
    ],
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
