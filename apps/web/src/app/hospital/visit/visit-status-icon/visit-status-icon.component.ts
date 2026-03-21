import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {VisitStatus, VisitStatuses} from '@melluin/common';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
    imports: [
        MatIcon,
        MatTooltip,
        TranslatePipe
    ],
    selector: 'app-visit-status-icon',
    templateUrl: './visit-status-icon.component.html',
    styleUrls: ['./visit-status-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisitStatusIconComponent {

    private static readonly STATUS_ICON_MAPPER = {
        [VisitStatuses.DRAFT]: 'draw',
        [VisitStatuses.SCHEDULED]: 'calendar_month',

        [VisitStatuses.STARTED]: 'theater_comedy',

        [VisitStatuses.ACTIVITIES_FILLED_OUT]: 'fact_check',
        [VisitStatuses.ALL_FILLED_OUT]: 'inventory_2',

        [VisitStatuses.CANCELED]: 'event_busy',
        [VisitStatuses.FAILED_BECAUSE_NO_CHILD]: 'face_retouching_off',
        [VisitStatuses.FAILED_FOR_OTHER_REASON]: 'do_not_touch',
        [VisitStatuses.SUCCESSFUL]: 'check_circle',
    }

    public readonly tooltipDisabled = input(true);
    public readonly status = input.required<VisitStatus>();
    protected readonly icon = computed(() => VisitStatusIconComponent.STATUS_ICON_MAPPER[this.status()]);

}
