import {Component, Input, ViewChild} from '@angular/core';
import {DepartmentBoxInfoListComponent} from '@fe/app/hospital/department-box/department-box-info-list/department-box-info-list.component';

@Component({
    selector: 'app-department-box-info-manager',
    templateUrl: './department-box-info-manager.component.html',
    styleUrls: ['./department-box-info-manager.component.scss']
})
export class DepartmentBoxInfoManagerComponent {

    @Input()
    public departmentId: string;

    @ViewChild(DepartmentBoxInfoListComponent)
    protected listComponent: DepartmentBoxInfoListComponent;

    protected itemAdded(): void {
        this.listComponent.reload();
    }

}
