import {Component, input} from '@angular/core';
import {HospitalVisit} from '@melluin/common';

@Component({
    selector: 'app-hospital-event-card',
    templateUrl: './hospital-event-card.component.html',
    styleUrls: ['./hospital-event-card.component.scss']
})
export class HospitalEventCardComponent {

    public readonly visit = input.required<HospitalVisit>();

}
