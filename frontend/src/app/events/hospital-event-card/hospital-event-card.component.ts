import {Component, Input} from '@angular/core';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {MelluinEvent} from '@shared/event/event';
import {EventType} from '@shared/event/event-type';

@Component({
    selector: 'app-hospital-event-card',
    templateUrl: './hospital-event-card.component.html',
    styleUrls: ['./hospital-event-card.component.scss']
})
export class HospitalEventCardComponent {

    protected visit: HospitalVisit;

    @Input()
    public set event(event: MelluinEvent) {
        if (event.type !== EventType.HOSPITAL_VISIT) {
            throw new Error('HospitalEventCardComponent cannot handle event that is not HospitalVisit');
        }
        this.visit = event as HospitalVisit;
    }

}
