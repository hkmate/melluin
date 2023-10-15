import {Component, Input} from '@angular/core';
import {VisitedChild} from '@shared/hospital-visit/visited-child';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';

@Component({
    selector: 'app-related-activity',
    templateUrl: './related-activity.component.html',
    styleUrls: ['./related-activity.component.scss']
})
export class RelatedActivityComponent {

    @Input()
    public childrenById: Record<string, VisitedChild>;

    @Input()
    public activity: HospitalVisitActivity;

}
