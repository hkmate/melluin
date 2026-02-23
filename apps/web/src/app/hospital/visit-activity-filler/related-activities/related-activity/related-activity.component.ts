import {Component, input} from '@angular/core';
import {VisitActivity, VisitedChild} from '@melluin/common';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle} from '@angular/material/card';
import {TranslatePipe} from '@ngx-translate/core';
import {NgIf} from '@angular/common';
import {MatChipListbox, MatChipRow} from '@angular/material/chips';

@Component({
    selector: 'app-related-activity',
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
    templateUrl: './related-activity.component.html'
})
export class RelatedActivityComponent {

    public readonly activity = input.required<VisitActivity>();
    public readonly childrenById = input.required<Record<string, VisitedChild>>();

}
