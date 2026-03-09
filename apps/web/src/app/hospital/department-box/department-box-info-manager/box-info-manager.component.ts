import {ChangeDetectionStrategy, Component, computed, inject, input, signal, viewChild} from '@angular/core';
import {DepartmentBoxStatus, isNotNil, Permission, UUID} from '@melluin/common';
import {BoxInfoListByVisitComponent} from '@fe/app/hospital/department-box/department-box-info-list/box-info-list-by-visit.component';
import {TranslatePipe} from '@ngx-translate/core';
import {MatMiniFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {DepartmentBoxInfoCreateComponent} from '@fe/app/hospital/department-box/department-box-info-create/department-box-info-create.component';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {BoxInfoListByDepartmentComponent} from '@fe/app/hospital/department-box/department-box-info-list/box-info-list-by-department.component';
import {DepartmentBoxService} from '@fe/app/hospital/department-box/department-box.service';
import {DepartmentBoxInfoListComponent} from '@fe/app/hospital/department-box/department-box-info-list/department-box-info-list.component';

@Component({
    imports: [
        TranslatePipe,
        MatMiniFabButton,
        MatIcon,
        DepartmentBoxInfoCreateComponent,
        BoxInfoListByVisitComponent,
        BoxInfoListByDepartmentComponent
    ],
    providers: [DepartmentBoxService],
    selector: 'app-box-info-manager',
    templateUrl: './box-info-manager.component.html',
    styleUrls: ['./box-info-manager.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoxInfoManagerComponent {

    private readonly permissions = inject(PermissionService);

    public readonly departmentId = input.required<UUID>();
    public readonly visitId = input<UUID>();

    protected readonly listByVisitComponent = viewChild(BoxInfoListByVisitComponent);
    protected readonly listByDepComponent = viewChild(BoxInfoListByDepartmentComponent);
    protected readonly listComponent = computed(() => this.getListComponent());

    protected readonly creatingInProcess = signal(false);
    protected readonly canUserWriteBox = computed(() => this.permissions.has(Permission.canWriteDepBox));

    protected creatorToggled(): void {
        this.creatingInProcess.update(oldValue => !oldValue);
    }

    protected closeCreation(): void {
        this.creatingInProcess.set(false);
    }

    protected handleNewItem(newReport: DepartmentBoxStatus): void {
        this.closeCreation();
        this.listComponent().addNewItemToFrontOfList(newReport);
    }

    private getListComponent(): DepartmentBoxInfoListComponent {
        const byDepList = this.listByDepComponent();
        const byVisitList = this.listByVisitComponent();
        if (isNotNil(byDepList)) {
            return byDepList;
        }
        if (isNotNil(byVisitList)) {
            return byVisitList;
        }
        throw new Error('Box list component not found');
    }

}
