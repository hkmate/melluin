import {Component, input} from '@angular/core';
import {VisitActivity, VisitedChild} from '@melluin/common';

@Component({
    selector: 'app-related-activity',
    templateUrl: './related-activity.component.html'
})
export class RelatedActivityComponent {

    public readonly activity = input.required<VisitActivity>();
    public readonly childrenById = input.required<Record<string, VisitedChild>>();

}
