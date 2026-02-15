import {Component, input} from '@angular/core';
import {DepartmentBoxStatus} from '@melluin/common';

@Component({
    selector: 'app-department-box-info',
    templateUrl: './department-box-info.component.html',
    styleUrls: ['./department-box-info.component.scss']
})
export class DepartmentBoxInfoComponent {

    public readonly boxStatus = input.required<DepartmentBoxStatus>();

}
