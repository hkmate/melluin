import {Component, input} from '@angular/core';
import {VisitedChild} from '@shared/hospital-visit/visited-child';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';

@Component({
    selector: 'app-related-activity',
    templateUrl: './related-activity.component.html'
})
export class RelatedActivityComponent {

    public readonly activity = input.required<HospitalVisitActivity>();
    public readonly childrenById = input.required<Record<string, VisitedChild>>();

}
