import {DepartmentBoxStatusReport} from '@shared/department/box/department-box-status-report';


export abstract class DepartmentBoxInfoManagerComponent {

    protected creatingInProcess = false;
    protected saveInProcess = false;

    protected abstract saveStatusReport(objectToSave: DepartmentBoxStatusReport): void;

    protected creatorToggled(): void {
        this.creatingInProcess = !this.creatingInProcess;
    }

    protected createCanceled(): void {
        this.creatingInProcess = false;
    }

}
