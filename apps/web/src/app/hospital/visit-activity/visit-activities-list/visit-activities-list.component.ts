import {Component, computed, input} from '@angular/core';
import {VisitActivity, isNilOrEmpty, VisitedChild, UUID} from '@melluin/common';
import {TranslatePipe} from '@ngx-translate/core';
import {VisitActivityCardComponent} from '@fe/app/hospital/visit-activity/visit-activity-card/visit-activity-card.component';

@Component({
    selector: 'app-visit-activities-list',
    templateUrl: './visit-activities-list.component.html',
    imports: [
        TranslatePipe,
        VisitActivityCardComponent
    ],
    styleUrls: ['./visit-activities-list.component.scss']
})
export class VisitActivitiesListComponent {

    public readonly childrenById = input.required<Record<UUID, VisitedChild>>();
    public readonly activities = input.required<Array<VisitActivity>>();

    protected readonly isEmpty = computed(() => isNilOrEmpty(this.activities()));

}
