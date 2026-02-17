import {Component, computed, input} from '@angular/core';
import {VisitActivity, isNilOrEmpty, VisitedChild} from '@melluin/common';

@Component({
    selector: 'app-visit-activities-list',
    templateUrl: './visit-activities-list.component.html',
    styleUrls: ['./visit-activities-list.component.scss']
})
export class VisitActivitiesListComponent {

    public readonly childrenById = input.required<Record<string, VisitedChild>>();
    public readonly activities = input.required<Array<VisitActivity>>();

    protected readonly isEmpty = computed(() => isNilOrEmpty(this.activities()));

}
