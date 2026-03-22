import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {UUID, VisitActivity, VisitedChild} from '@melluin/common';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle} from '@angular/material/card';
import {TranslatePipe} from '@ngx-translate/core';
import {MatChipListbox, MatChipRow} from '@angular/material/chips';

@Component({
    imports: [
        MatCard,
        MatCardHeader,
        MatCardSubtitle,
        TranslatePipe,
        MatChipListbox,
        MatChipRow,
        MatCardContent
    ],
    selector: 'app-visit-activity-card',
    templateUrl: './visit-activity-card.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisitActivityCardComponent {

    public readonly childrenById = input.required<Record<UUID, VisitedChild>>();
    public readonly activity = input.required<VisitActivity>();

}
