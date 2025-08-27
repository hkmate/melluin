import {Component, input} from '@angular/core';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';
import {VisitedChild} from '@shared/hospital-visit/visited-child';

@Component({
    selector: 'app-visit-activity-card',
    templateUrl: './visit-activity-card.component.html'
})
export class VisitActivityCardComponent {

    public readonly childrenById = input.required<Record<string, VisitedChild>>();
    public readonly activity = input.required<HospitalVisitActivity>();

}
