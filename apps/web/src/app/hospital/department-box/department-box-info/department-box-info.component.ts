import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {DepartmentBoxStatus} from '@melluin/common';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle} from '@angular/material/card';
import {DatePipe} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
    imports: [
        MatCard,
        MatCardHeader,
        MatCardSubtitle,
        DatePipe,
        TranslatePipe,
        MatCardContent
    ],
    selector: 'app-department-box-info',
    templateUrl: './department-box-info.component.html',
    styleUrls: ['./department-box-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentBoxInfoComponent {

    public readonly boxStatus = input.required<DepartmentBoxStatus>();

}
