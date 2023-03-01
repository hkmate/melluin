import {Component, Input} from '@angular/core';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';
import {PatientChild} from '@shared/child/patient-child';

@Component({
    selector: 'app-visit-activity-card',
    templateUrl: './visit-activity-card.component.html',
    styleUrls: ['./visit-activity-card.component.scss']
})
export class VisitActivityCardComponent {

    @Input()
    public childrenById: Record<string, PatientChild>;

    @Input()
    public activity: HospitalVisitActivity;

}
