import {Component, input} from '@angular/core';
import {Department} from '@melluin/common';
import {TranslatePipe} from '@ngx-translate/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {DatePipe} from '@angular/common';
import {OptionalPipe} from '@fe/app/util/optional.pipe';

@Component({
    selector: 'app-department-data-presenter',
    templateUrl: './department-data-presenter.component.html',
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
    styleUrls: ['./department-data-presenter.component.scss']
})
export class DepartmentDataPresenterComponent {

    public readonly department = input<Department>();

}
