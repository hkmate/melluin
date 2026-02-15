import {Component, input} from '@angular/core';
import {HospitalVisitActivity, VisitedChild} from '@melluin/common';

@Component({
    selector: 'app-related-activity',
    templateUrl: './related-activity.component.html'
})
export class RelatedActivityComponent {

    public readonly activity = input.required<HospitalVisitActivity>();
    public readonly childrenById = input.required<Record<string, VisitedChild>>();

}
