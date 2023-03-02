import {Component, Input} from '@angular/core';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';

@Component({
    selector: 'app-hospital-event-card',
    templateUrl: './hospital-event-card.component.html',
    styleUrls: ['./hospital-event-card.component.scss']
})
export class HospitalEventCardComponent {

    @Input()
    public visit: HospitalVisit;

    @Input()
    public needFillButton = false;

    protected isFillButtonNeeded(): boolean {
        return this.needFillButton
            && [HospitalVisitStatus.SCHEDULED, HospitalVisitStatus.STARTED].includes(this.visit.status);
    }

}
