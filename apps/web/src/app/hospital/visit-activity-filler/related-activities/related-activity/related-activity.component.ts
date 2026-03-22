import {Component, input} from '@angular/core';
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
    selector: 'app-related-activity',
    templateUrl: './related-activity.component.html'
})
export class RelatedActivityComponent {

    public readonly activity = input.required<VisitActivity>();
    public readonly childrenById = input.required<Record<UUID, VisitedChild>>();

}
