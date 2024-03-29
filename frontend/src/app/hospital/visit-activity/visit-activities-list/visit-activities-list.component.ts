import {Component, Input} from '@angular/core';
import {isNilOrEmpty} from '@shared/util/util';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';
import {VisitedChild} from '@shared/hospital-visit/visited-child';

@Component({
    selector: 'app-visit-activities-list',
    templateUrl: './visit-activities-list.component.html',
    styleUrls: ['./visit-activities-list.component.scss']
})
export class VisitActivitiesListComponent {

    @Input()
    public childrenById: Record<string, VisitedChild>;

    @Input()
    public activities: Array<HospitalVisitActivity>;

    protected isEmpty(): boolean {
        return isNilOrEmpty(this.activities);
    }

}
