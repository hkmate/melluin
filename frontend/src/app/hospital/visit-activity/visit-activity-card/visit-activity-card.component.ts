import {Component, Input} from '@angular/core';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';
import {VisitedChild} from '@shared/hospital-visit/visited-child';

@Component({
    selector: 'app-visit-activity-card',
    templateUrl: './visit-activity-card.component.html',
    styleUrls: ['./visit-activity-card.component.scss']
})
export class VisitActivityCardComponent {

    @Input()
    public childrenById: Record<string, VisitedChild>;

    @Input()
    public activity: HospitalVisitActivity;

}
