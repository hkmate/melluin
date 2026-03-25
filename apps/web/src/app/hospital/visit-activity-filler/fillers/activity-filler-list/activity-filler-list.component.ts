import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {Permission} from '@melluin/common';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {convertToChildrenById} from '@fe/app/hospital/visit-activity-filler/model/visited-child-by-id';
import {TranslatePipe} from '@ngx-translate/core';
import {MatMiniFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {FillerActivityItemComponent} from '@fe/app/hospital/visit-activity-filler/fillers/activity-filler-list/filler-activity-item/filler-activity-item.component';
import {VisitActivityFillerFactory} from '@fe/app/hospital/visit-activity-filler/visit-activity-filler.factory';
import {FillerActivityEditorComponent} from '@fe/app/hospital/visit-activity-filler/fillers/activity-filler-list/filler-activity-editor/filler-activity-editor.component';

@Component({
    imports: [
        TranslatePipe,
        MatMiniFabButton,
        MatIcon,
        FillerActivityItemComponent,
        FillerActivityEditorComponent
    ],
    selector: 'app-activity-filler-list',
    templateUrl: './activity-filler-list.component.html',
    styleUrls: ['./activity-filler-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityFillerListComponent {

    protected readonly Permission = Permission;

    protected readonly permissions = inject(PermissionService);
    private readonly filler = inject(VisitActivityFillerFactory).getService();

    protected readonly activities = this.filler.getActivities();
    private readonly children = this.filler.getChildren();
    protected readonly childrenById = computed(() => convertToChildrenById(this.children()));
    protected readonly creatingInProcess = signal(false);

    protected creatorToggled(): void {
        this.creatingInProcess.update(prev => !prev);
    }

    protected closeCreator(): void {
        this.creatingInProcess.set(false);
    }

}
