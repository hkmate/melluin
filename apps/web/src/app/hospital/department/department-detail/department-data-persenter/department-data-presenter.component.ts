import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {Department} from '@melluin/common';
import {TranslatePipe} from '@ngx-translate/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {DatePipe} from '@angular/common';
import {OptionalPipe} from '@fe/app/util/optional.pipe';

@Component({
    imports: [
        TranslatePipe,
        MatCard,
        MatCardHeader,
        MatCardSubtitle,
        MatCardTitle,
        DatePipe,
        OptionalPipe,
        MatCardContent
    ],
    selector: 'app-department-data-presenter',
    templateUrl: './department-data-presenter.component.html',
    styleUrls: ['./department-data-presenter.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentDataPresenterComponent {

    public readonly department = input.required<Department>();

}
