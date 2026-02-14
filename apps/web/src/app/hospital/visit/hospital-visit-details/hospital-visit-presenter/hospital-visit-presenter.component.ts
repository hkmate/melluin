import {Component, input} from '@angular/core';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';

@Component({
    selector: 'app-hospital-visit-presenter',
    templateUrl: './hospital-visit-presenter.component.html',
    styleUrls: ['./hospital-visit-presenter.component.scss']
})
export class HospitalVisitPresenterComponent {

    public readonly visit = input.required<HospitalVisit>();

    protected selfLink(): string {
        return window.location.href;
    }

}
