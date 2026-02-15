import {Component, input} from '@angular/core';
import {Department} from '@melluin/common';

@Component({
    selector: 'app-department-data-presenter',
    templateUrl: './department-data-presenter.component.html',
    styleUrls: ['./department-data-presenter.component.scss']
})
export class DepartmentDataPresenterComponent {

    public readonly department = input<Department>();

}
