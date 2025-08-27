import {Component, inject, input} from '@angular/core';
import {VisitedChild} from '@shared/hospital-visit/visited-child';
import {HospitalVisitActivityFillerService} from '@fe/app/hospital/hospital-visit-activity-filler/hospital-visit-activity-filler.service';
import {ConfirmationService} from '@fe/app/confirmation/confirmation.service';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationDialogConfig} from '@fe/app/confirmation/confirmation-dialog-config';
import {NOOP} from '@shared/util/util';

@Component({
    selector: 'app-filler-child-item',
    templateUrl: './filler-child-item.component.html'
})
export class FillerChildItemComponent {

    private readonly translateService = inject(TranslateService);
    private readonly confirmation = inject(ConfirmationService);
    private readonly fillerService = inject(HospitalVisitActivityFillerService);

    public readonly child = input.required<VisitedChild>();

    protected edit = false;

    protected changeToEdit(): void {
        this.edit = true;
    }

    protected endEdit(): void {
        this.edit = false;
    }

    protected removeChild(): void {
        this.confirmation.getConfirm(this.getDeleteConfirmDialogConfig())
            .then(() => this.fillerService.removeChild(this.child()).subscribe())
            .catch(NOOP);
    }

    private getDeleteConfirmDialogConfig(): Partial<ConfirmationDialogConfig> {
        return {
            message: this.translateService.instant('HospitalVisit.ConfirmChildRemove',
                {name: this.child().child.name})
        }
    }

}
