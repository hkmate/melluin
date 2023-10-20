import {Component, Input} from '@angular/core';
import {HospitalVisitActivityFillerService} from '@fe/app/hospital/hospital-visit-activity-filler/hospital-visit-activity-filler.service';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';
import {VisitedChildById} from '@fe/app/hospital/hospital-visit-activity-filler/model/visited-child-by-id';
import {NOOP} from '@shared/util/util';
import {ConfirmationDialogConfig} from '@fe/app/confirmation/confirmation-dialog-config';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from '@fe/app/confirmation/confirmation.service';

@Component({
    selector: 'app-filler-activity-item',
    templateUrl: './filler-activity-item.component.html',
    styleUrls: ['./filler-activity-item.component.scss']
})
export class FillerActivityItemComponent {

    @Input()
    public activity: HospitalVisitActivity;

    @Input()
    public childrenById: VisitedChildById;

    protected edit = false;

    constructor(private readonly translateService: TranslateService,
                private readonly confirmation: ConfirmationService,
                private readonly fillerService: HospitalVisitActivityFillerService) {
    }

    protected changeToEdit(): void {
        this.edit = true;
    }

    protected endEdit(): void {
        this.edit = false;
    }

    protected removeActivity(): void {
        this.confirmation.getConfirm(this.getDeleteConfirmDialogConfig())
            .then(() => this.fillerService.removeActivity(this.activity).subscribe())
            .catch(NOOP);
    }

    private getDeleteConfirmDialogConfig(): Partial<ConfirmationDialogConfig> {
        return {
            message: this.translateService.instant('HospitalVisit.ConfirmActivityRemove')
        }
    }

}
