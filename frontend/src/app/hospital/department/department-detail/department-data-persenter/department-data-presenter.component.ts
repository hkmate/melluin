import {Component, Input} from '@angular/core';
import {Department} from '@shared/department/department';

@Component({
    selector: 'app-department-data-presenter',
    templateUrl: './department-data-presenter.component.html',
    styleUrls: ['./department-data-presenter.component.scss']
})
export class DepartmentDataPresenterComponent {

    @Input()
    public department?: Department;

}
