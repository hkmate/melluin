import {Component, Input, ViewChild} from '@angular/core';
import {DepartmentBoxService} from '@fe/app/hospital/department-box/department-box.service';
import {DepartmentBoxStatusReport} from '@shared/department/box/department-box-status-report';
import {DepartmentBoxInfoListComponent} from '@fe/app/hospital/department-box/department-box-info-list/department-box-info-list.component';

@Component({
    selector: 'app-department-box-info-manager',
    templateUrl: './department-box-info-manager.component.html',
    styleUrls: ['./department-box-info-manager.component.scss']
})
export class DepartmentBoxInfoManagerComponent {

    @Input()
    public departmentId: string;

    protected creatingInProcess = false;
    protected saveInProcess = false;

    @ViewChild(DepartmentBoxInfoListComponent)
    protected listComponent: DepartmentBoxInfoListComponent;

    constructor(private readonly boxStatusService: DepartmentBoxService) {
    }

    protected creatorToggled(): void {
        this.creatingInProcess = !this.creatingInProcess;
    }

    protected createCanceled(): void {
        this.creatingInProcess = false;
    }

    protected createFinished(objectToSave: DepartmentBoxStatusReport): void {
        this.saveInProcess = true;
        this.boxStatusService.addBoxStatus(this.departmentId, objectToSave).subscribe(() => {
            this.listComponent.reload();
            this.creatingInProcess = false;
            this.saveInProcess = false;
        });
    }

}
