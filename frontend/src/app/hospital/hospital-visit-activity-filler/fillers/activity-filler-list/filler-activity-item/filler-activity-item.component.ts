import {Component, inject, input, signal} from '@angular/core';
import {HospitalVisitActivityFillerService} from '@fe/app/hospital/hospital-visit-activity-filler/hospital-visit-activity-filler.service';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';
import {VisitedChildById} from '@fe/app/hospital/hospital-visit-activity-filler/model/visited-child-by-id';
import {NOOP} from '@shared/util/util';
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
    private readonly fillerService = inject(HospitalVisitActivityFillerService);

    public readonly activity = input.required<HospitalVisitActivity>();
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
            message: this.translateService.instant('HospitalVisit.ConfirmActivityRemove')
        }
    }

}
