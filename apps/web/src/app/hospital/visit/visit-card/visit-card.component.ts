import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {Visit} from '@melluin/common';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle} from '@angular/material/card';
import {DatePipe} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {VisitStatusIconComponent} from '@fe/app/hospital/visit/visit-status-icon/visit-status-icon.component';
import {RouterLink} from '@angular/router';
import {MatChipListbox, MatChipRow} from '@angular/material/chips';
import {PersonNamePipe} from '@fe/app/people/person-name.pipe';

@Component({
    imports: [
        MatCard,
        MatCardHeader,
        MatCardSubtitle,
        DatePipe,
        TranslatePipe,
        VisitStatusIconComponent,
        MatCardContent,
        RouterLink,
        MatChipListbox,
        MatChipRow,
        PersonNamePipe
    ],
    selector: 'app-visit-card',
    templateUrl: './visit-card.component.html',
    styleUrls: ['./visit-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisitCardComponent {

    public readonly visit = input.required<Visit>();

}
