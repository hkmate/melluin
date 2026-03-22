import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {UUID, VisitActivity, VisitedChild} from '@melluin/common';
import {TranslatePipe} from '@ngx-translate/core';
import {VisitActivityCardComponent} from '@fe/app/hospital/visit-activity/visit-activity-card/visit-activity-card.component';

@Component({
    imports: [
        TranslatePipe,
        VisitActivityCardComponent
    ],
    selector: 'app-visit-activities-list',
    templateUrl: './visit-activities-list.component.html',
    styleUrls: ['./visit-activities-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisitActivitiesListComponent {

    public readonly childrenById = input.required<Record<UUID, VisitedChild>>();
    public readonly activities = input.required<Array<VisitActivity>>();

}
