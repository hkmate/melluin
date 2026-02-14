import {Component, computed, input} from '@angular/core';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TranslateModule} from '@ngx-translate/core';

@Component({
    selector: 'app-visit-status-icon',
    templateUrl: './visit-status-icon.component.html',
    styleUrls: ['./visit-status-icon.component.scss'],
    imports: [
        MatIconModule,
        MatTooltipModule,
        TranslateModule
    ],
    standalone: true
})
export class VisitStatusIconComponent {

    private static readonly STATUS_ICON_MAPPER = {
        [HospitalVisitStatus.DRAFT]: 'draw',
        [HospitalVisitStatus.SCHEDULED]: 'calendar_month',

        [HospitalVisitStatus.STARTED]: 'theater_comedy',

        [HospitalVisitStatus.ACTIVITIES_FILLED_OUT]: 'fact_check',
        [HospitalVisitStatus.ALL_FILLED_OUT]: 'inventory_2',

        [HospitalVisitStatus.CANCELED]: 'event_busy',
        [HospitalVisitStatus.FAILED_BECAUSE_NO_CHILD]: 'face_retouching_off',
        [HospitalVisitStatus.FAILED_FOR_OTHER_REASON]: 'do_not_touch',
        [HospitalVisitStatus.SUCCESSFUL]: 'check_circle',
    }

    public readonly tooltipDisabled = input(true);
    public readonly status = input.required<HospitalVisitStatus>();
    protected readonly icon = computed(() => VisitStatusIconComponent.STATUS_ICON_MAPPER[this.status()]);

}
