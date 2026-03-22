import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {Visit} from '@melluin/common';
import {TranslatePipe} from '@ngx-translate/core';
import {CopierComponent} from '@fe/app/util/copier/copier.component';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {DatePipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {MatChipListbox, MatChipRow} from '@angular/material/chips';
import {PersonNamePipe} from '@fe/app/people/person-name.pipe';
import {VisitStatusIconComponent} from '@fe/app/hospital/visit/visit-status-icon/visit-status-icon.component';
import {MinToHourPipe} from '@fe/app/util/min-to-hour.pipe';
import {OptionalPipe} from '@fe/app/util/optional.pipe';

@Component({
    imports: [
        TranslatePipe,
        CopierComponent,
        MatCard,
        MatCardHeader,
        MatCardSubtitle,
        MatCardTitle,
        DatePipe,
        RouterLink,
        MatChipListbox,
        MatChipRow,
        PersonNamePipe,
        VisitStatusIconComponent,
        MinToHourPipe,
        OptionalPipe,
        MatCardContent
    ],
    selector: 'app-visit-presenter',
    templateUrl: './visit-presenter.component.html',
    styleUrls: ['./visit-presenter.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'data-details',
    }
})
export class VisitPresenterComponent {

    public readonly visit = input.required<Visit>();

    protected selfLink(): string {
        return window.location.href;
    }

}
