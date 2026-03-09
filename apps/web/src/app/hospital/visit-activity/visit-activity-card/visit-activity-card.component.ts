import {Component, input} from '@angular/core';
import {UUID, VisitActivity, VisitedChild} from '@melluin/common';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle} from '@angular/material/card';
import {TranslatePipe} from '@ngx-translate/core';
import {NgIf} from '@angular/common';
import {MatChipListbox, MatChipRow} from '@angular/material/chips';

@Component({
    selector: 'app-visit-activity-card',
    imports: [
        MatCard,
        MatCardHeader,
        MatCardSubtitle,
        TranslatePipe,
        NgIf,
        MatChipListbox,
        MatChipRow,
        MatCardContent
    ],
    templateUrl: './visit-activity-card.component.html'
})
export class VisitActivityCardComponent {

    public readonly childrenById = input.required<Record<UUID, VisitedChild>>();
    public readonly activity = input.required<VisitActivity>();

}
