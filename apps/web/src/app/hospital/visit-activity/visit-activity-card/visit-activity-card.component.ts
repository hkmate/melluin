import {Component, input} from '@angular/core';
import {VisitActivity, VisitedChild} from '@melluin/common';

@Component({
    selector: 'app-visit-activity-card',
    templateUrl: './visit-activity-card.component.html'
})
export class VisitActivityCardComponent {

    public readonly childrenById = input.required<Record<string, VisitedChild>>();
    public readonly activity = input.required<VisitActivity>();

}
