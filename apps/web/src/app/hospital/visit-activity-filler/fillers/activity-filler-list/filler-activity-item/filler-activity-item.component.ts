import {Component, inject, input, signal} from '@angular/core';
import {VisitActivityFillerService} from '@fe/app/hospital/visit-activity-filler/visit-activity-filler.service';
import {VisitActivity, NOOP} from '@melluin/common';
import {VisitedChildById} from '@fe/app/hospital/visit-activity-filler/model/visited-child-by-id';
import {ConfirmationDialogConfig} from '@fe/app/confirmation/confirmation-dialog-config';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from '@fe/app/confirmation/confirmation.service';

@Component({
    selector: 'app-filler-activity-item',
    templateUrl: './filler-activity-item.component.html'
})
export class FillerActivityItemComponent {

    private readonly translateService = inject(TranslateService);
    private readonly confirmation = inject(ConfirmationService);
    private readonly fillerService = inject(VisitActivityFillerService);

    public readonly activity = input.required<VisitActivity>();
    public readonly childrenById = input.required<VisitedChildById>();

    protected readonly edit = signal(false);

    protected changeToEdit(): void {
        this.edit.set(true);
    }

    protected endEdit(): void {
        this.edit.set(false);
    }

    protected removeActivity(): void {
        this.confirmation.getConfirm(this.getDeleteConfirmDialogConfig())
            .then(() => this.fillerService.removeActivity(this.activity()).subscribe())
            .catch(NOOP);
    }

    private getDeleteConfirmDialogConfig(): Partial<ConfirmationDialogConfig> {
        return {
            message: this.translateService.instant('Visit.ConfirmActivityRemove')
        }
    }

}
