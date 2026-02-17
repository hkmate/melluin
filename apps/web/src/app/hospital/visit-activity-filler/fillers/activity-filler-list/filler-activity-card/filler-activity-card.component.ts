import {Component, input, output} from '@angular/core';
import {VisitActivity} from '@melluin/common';
import {VisitedChildById} from '@fe/app/hospital/visit-activity-filler/model/visited-child-by-id';

@Component({
    selector: 'app-filler-activity-card',
    templateUrl: './filler-activity-card.component.html',
    styleUrls: ['./filler-activity-card.component.scss']
})
export class FillerActivityCardComponent {

    public readonly activity = input.required<VisitActivity>();
    public readonly childrenById = input.required<VisitedChildById>();

    public readonly editWanted = output<void>();
    public readonly removeWanted = output<void>();

}
