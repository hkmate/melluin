import {Component, EventEmitter, Input, Output} from '@angular/core';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';
import {VisitedChildById} from '@fe/app/hospital/hospital-visit-activity-filler/model/visited-child-by-id';

@Component({
    selector: 'app-filler-activity-card',
    templateUrl: './filler-activity-card.component.html',
    styleUrls: ['./filler-activity-card.component.scss']
})
export class FillerActivityCardComponent {

    @Input()
    public activity: HospitalVisitActivity;

    @Input()
    public childrenById: VisitedChildById;

    @Output()
    public editWanted = new EventEmitter<void>();

    @Output()
    public removeWanted = new EventEmitter<void>();

}
