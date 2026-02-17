import {Component, computed, input} from '@angular/core';
import {VisitStatus} from '@melluin/common';
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
        [VisitStatus.DRAFT]: 'draw',
        [VisitStatus.SCHEDULED]: 'calendar_month',

        [VisitStatus.STARTED]: 'theater_comedy',

        [VisitStatus.ACTIVITIES_FILLED_OUT]: 'fact_check',
        [VisitStatus.ALL_FILLED_OUT]: 'inventory_2',

        [VisitStatus.CANCELED]: 'event_busy',
        [VisitStatus.FAILED_BECAUSE_NO_CHILD]: 'face_retouching_off',
        [VisitStatus.FAILED_FOR_OTHER_REASON]: 'do_not_touch',
        [VisitStatus.SUCCESSFUL]: 'check_circle',
    }

    public readonly tooltipDisabled = input(true);
    public readonly status = input.required<VisitStatus>();
    protected readonly icon = computed(() => VisitStatusIconComponent.STATUS_ICON_MAPPER[this.status()]);

}
