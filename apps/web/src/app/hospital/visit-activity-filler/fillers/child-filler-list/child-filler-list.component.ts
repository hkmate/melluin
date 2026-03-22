import {Component, inject, signal} from '@angular/core';
import {VisitActivityFillerService} from '@fe/app/hospital/visit-activity-filler/visit-activity-filler.service';
import {Observable} from 'rxjs';
import {Permission, VisitedChild} from '@melluin/common';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {TranslatePipe} from '@ngx-translate/core';
import {MatMiniFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {FillerChildCreateComponent} from '@fe/app/hospital/visit-activity-filler/fillers/child-filler-list/filler-child-create/filler-child-create.component';
import {AsyncPipe} from '@angular/common';
import {FillerChildItemComponent} from '@fe/app/hospital/visit-activity-filler/fillers/child-filler-list/filler-child-item/filler-child-item.component';

@Component({
    imports: [
        TranslatePipe,
        MatMiniFabButton,
        MatIcon,
        FillerChildCreateComponent,
        AsyncPipe,
        FillerChildItemComponent
    ],
    selector: 'app-child-filler-list',
    templateUrl: './child-filler-list.component.html',
    styleUrls: ['./child-filler-list.component.scss']
})
export class ChildFillerListComponent {

    protected readonly permissions = inject(PermissionService);
    private readonly filler = inject(VisitActivityFillerService);

    protected readonly Permission = Permission;

    protected children$: Observable<Array<VisitedChild>>;
    protected readonly creatingInProcess = signal(false);

    constructor() {
        this.children$ = this.filler.getChildren();
    }

    protected creatorToggled(): void {
        this.creatingInProcess.update(oldValue => !oldValue);
    }

    protected closeCreator(): void {
        this.creatingInProcess.set(false);
    }

}
