import {Component, computed, input} from '@angular/core';
import {isNilOrEmpty} from '@shared/util/util';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';
import {VisitedChild} from '@shared/hospital-visit/visited-child';

@Component({
    selector: 'app-visit-activities-list',
    templateUrl: './visit-activities-list.component.html',
    styleUrls: ['./visit-activities-list.component.scss']
})
export class VisitActivitiesListComponent {

    public readonly childrenById = input.required<Record<string, VisitedChild>>();
    public readonly activities = input.required<Array<HospitalVisitActivity>>();

    protected readonly isEmpty = computed(() => isNilOrEmpty(this.activities()));

}
