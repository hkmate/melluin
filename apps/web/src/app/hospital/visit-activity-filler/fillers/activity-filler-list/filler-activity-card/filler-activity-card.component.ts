import {Component, input, output} from '@angular/core';
import {VisitActivity} from '@melluin/common';
import {VisitedChildById} from '@fe/app/hospital/visit-activity-filler/model/visited-child-by-id';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle} from '@angular/material/card';
import {TranslatePipe} from '@ngx-translate/core';
import {NgIf} from '@angular/common';
import {MatChipListbox, MatChipRow} from '@angular/material/chips';
import {MatMiniFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
    selector: 'app-filler-activity-card',
    templateUrl: './filler-activity-card.component.html',
    imports: [
        MatCard,
        MatCardHeader,
        MatCardSubtitle,
        TranslatePipe,
        NgIf,
        MatChipListbox,
        MatChipRow,
        MatMiniFabButton,
        MatIcon,
        MatCardContent
    ],
    styleUrls: ['./filler-activity-card.component.scss']
})
export class FillerActivityCardComponent {

    public readonly activity = input.required<VisitActivity>();
    public readonly childrenById = input.required<VisitedChildById>();

    public readonly editWanted = output<void>();
    public readonly removeWanted = output<void>();

}
