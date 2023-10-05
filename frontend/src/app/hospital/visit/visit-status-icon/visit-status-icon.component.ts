import {Component, Input} from '@angular/core';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TranslateModule} from '@ngx-translate/core';

@Component({
    selector: 'app-visit-status-icon',
    templateUrl: './visit-status-icon.component.html',
    styleUrls: ['./visit-status-icon.component.scss'],
    imports: [
        NgSwitch,
        NgSwitchDefault,
        NgSwitchCase,
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

    @Input()
    public tooltipDisabled = true;

    protected icon: string;
    protected visitStatus: HospitalVisitStatus;

    @Input()
    public set status(value: HospitalVisitStatus) {
        this.visitStatus = value;
        this.icon = VisitStatusIconComponent.STATUS_ICON_MAPPER[value];
    }

}
