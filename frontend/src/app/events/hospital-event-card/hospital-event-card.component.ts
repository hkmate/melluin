import {Component, Input} from '@angular/core';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';

@Component({
    selector: 'app-hospital-event-card',
    templateUrl: './hospital-event-card.component.html',
    styleUrls: ['./hospital-event-card.component.scss']
})
export class HospitalEventCardComponent {

    @Input()
    public visit: HospitalVisit;

}
