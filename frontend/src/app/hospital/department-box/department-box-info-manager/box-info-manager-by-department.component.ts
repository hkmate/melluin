import {Component, inject, input, viewChild} from '@angular/core';
import {DepartmentBoxInfoManagerComponent} from '@fe/app/hospital/department-box/department-box-info-manager/department-box-info-manager.component';
import {MessageService} from '@fe/app/util/message.service';
import {DepartmentBoxService} from '@fe/app/hospital/department-box/department-box.service';
import {DepartmentBoxStatusReport} from '@shared/department/box/department-box-status-report';
import {BoxInfoListByDepartmentComponent} from '@fe/app/hospital/department-box/department-box-info-list/box-info-list-by-department.component';

@Component({
    selector: 'app-box-info-manager-by-department',
    templateUrl: './box-info-manager-by-department.component.html',
    styleUrls: ['./department-box-info-manager.component.scss']
})
export class BoxInfoManagerByDepartmentComponent extends DepartmentBoxInfoManagerComponent {

    private readonly msg = inject(MessageService);
    private readonly boxStatusService = inject(DepartmentBoxService);

    public readonly departmentId = input.required<string>();

    protected readonly listComponent = viewChild.required(BoxInfoListByDepartmentComponent);

    protected saveStatusReport(objectToSave: DepartmentBoxStatusReport): void {
        this.saveInProcess = true;
        this.boxStatusService.addBoxStatus(this.departmentId(), objectToSave).subscribe(newStatus => {
            this.creatingInProcess = false;
            this.saveInProcess = false;
            this.msg.success('SaveSuccessful');
            this.itemAdded();
        });
    }

    private itemAdded(): void {
        this.listComponent().reload();
    }

}
