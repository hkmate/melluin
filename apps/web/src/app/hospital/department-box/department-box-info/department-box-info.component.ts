import {Component, input} from '@angular/core';
import {DepartmentBoxStatus} from '@melluin/common';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle} from '@angular/material/card';
import {DatePipe} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
    selector: 'app-department-box-info',
    templateUrl: './department-box-info.component.html',
    imports: [
        MatCard,
        MatCardHeader,
        MatCardSubtitle,
        DatePipe,
        TranslatePipe,
        MatCardContent
    ],
    styleUrls: ['./department-box-info.component.scss']
})
export class DepartmentBoxInfoComponent {

    public readonly boxStatus = input.required<DepartmentBoxStatus>();

}
