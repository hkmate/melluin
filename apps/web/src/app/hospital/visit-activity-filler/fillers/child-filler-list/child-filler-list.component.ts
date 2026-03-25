import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {Permission} from '@melluin/common';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {TranslatePipe} from '@ngx-translate/core';
import {MatMiniFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {FillerChildItemComponent} from '@fe/app/hospital/visit-activity-filler/fillers/child-filler-list/filler-child-item/filler-child-item.component';
import {VisitActivityFillerFactory} from '@fe/app/hospital/visit-activity-filler/visit-activity-filler.factory';
import {FillerChildEditorComponent} from '@fe/app/hospital/visit-activity-filler/fillers/child-filler-list/filler-child-editor/filler-child-editor.component';

@Component({
    imports: [
        TranslatePipe,
        MatMiniFabButton,
        MatIcon,
        FillerChildItemComponent,
        FillerChildEditorComponent
    ],
    selector: 'app-child-filler-list',
    templateUrl: './child-filler-list.component.html',
    styleUrls: ['./child-filler-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildFillerListComponent {

    protected readonly permissions = inject(PermissionService);
    private readonly filler = inject(VisitActivityFillerFactory).getService();

    protected readonly Permission = Permission;

    protected readonly children = this.filler.getChildren();
    protected readonly creatingInProcess = signal(false);

    protected creatorToggled(): void {
        this.creatingInProcess.update(prev => !prev);
    }

    protected closeCreator(): void {
        this.creatingInProcess.set(false);
    }

}
