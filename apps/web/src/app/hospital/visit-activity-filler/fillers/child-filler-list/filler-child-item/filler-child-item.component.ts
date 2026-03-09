import {Component, inject, input} from '@angular/core';
import {NOOP, VisitedChild} from '@melluin/common';
import {VisitActivityFillerService} from '@fe/app/hospital/visit-activity-filler/visit-activity-filler.service';
import {ConfirmationService} from '@fe/app/confirmation/confirmation.service';
import {ConfirmationDialogConfig} from '@fe/app/confirmation/confirmation-dialog-config';
import {FillerChildEditorComponent} from '@fe/app/hospital/visit-activity-filler/fillers/child-filler-list/filler-child-editor/filler-child-editor.component';
import {FillerChildCardComponent} from '@fe/app/hospital/visit-activity-filler/fillers/child-filler-list/filler-child-card/filler-child-card.component';
import {t} from '@fe/app/util/translate/translate';

@Component({
    selector: 'app-filler-child-item',
    imports: [
        FillerChildEditorComponent,
        FillerChildCardComponent
    ],
    templateUrl: './filler-child-item.component.html'
})
export class FillerChildItemComponent {

    private readonly confirmation = inject(ConfirmationService);
    private readonly fillerService = inject(VisitActivityFillerService);

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
            message: t('Visit.ConfirmChildRemove', {name: this.child().child.name})
        }
    }

}
