import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {RouteDataHandler} from '@fe/app/util/route-data-handler/route-data-handler';
import {CREATE_MARKER, CreateMarkerType, PATHS} from '@fe/app/app-paths';
import {DateUtil, Department, isNil, Permission} from '@melluin/common';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DepartmentDataPresenterComponent} from '@fe/app/hospital/department/department-detail/department-data-persenter/department-data-presenter.component';
import {TranslatePipe} from '@ngx-translate/core';
import {MatButton} from '@angular/material/button';
import {DepartmentDataFormComponent} from '@fe/app/hospital/department/department-detail/department-data-form/department-data-form.component';
import {BoxInfoManagerComponent} from '@fe/app/hospital/department-box/department-box-info-manager/box-info-manager.component';

@Component({
    imports: [
        DepartmentDataPresenterComponent,
        TranslatePipe,
        MatButton,
        DepartmentDataFormComponent,
        BoxInfoManagerComponent
    ],
    providers: [RouteDataHandler],
    selector: 'app-department-detail',
    templateUrl: './department-detail.component.html',
    styleUrls: ['./department-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentDetailComponent {

    private readonly router = inject(Router);
    private readonly location = inject(Location);
    private readonly route = inject(RouteDataHandler);
    private readonly permissions = inject(PermissionService);

    protected readonly isEditMode = computed(() => this.isEdit() || this.isCreation());
    protected readonly department = signal<Department | undefined>(undefined);

    private isCreation = signal(false);
    private isEdit = signal(false);
    private now = DateUtil.now().toISOString();

    constructor() {
        this.route.getData<Department | CreateMarkerType>('department').pipe(takeUntilDestroyed()).subscribe(
            departmentInfo => {
                this.setUp(departmentInfo);
            }
        );
    }

    protected setDepartment(data: Department): void {
        this.setToPresent();
        this.setIdInUrl(data.id);
        this.department.set(data);
    }

    protected cancelEditing(): void {
        if (this.isCreation()) {
            this.router.navigate([PATHS.departments.main]);
        }
        this.setToPresent();
    }

    protected switchToEdit(): void {
        if (!this.isEditEnabled()) {
            return;
        }
        this.isEdit.set(true);
        this.route.setParam('edit', true);
    }

    protected isEditEnabled(): boolean {
        const validTo = this.department()?.validTo;
        return this.permissions.has(Permission.canWriteDepartment)
            && (isNil(validTo) || this.now < validTo);
    }

    private setToPresent(): void {
        this.isEdit.set(false);
        this.isCreation.set(false);
        this.route.removeParam('edit');
    }

    private setUp(departmentInfo: Department | CreateMarkerType): void {
        if (departmentInfo === CREATE_MARKER) {
            this.isCreation.set(true);
            return;
        }
        this.setUpDepartment(departmentInfo);
    }

    private setUpDepartment(departmentInfo: Department): void {
        this.department.set(departmentInfo);
        if (this.route.getParam('edit') === 'true') {
            this.switchToEdit();
        }
    }

    private setIdInUrl(departmentId: string): void {
        this.location.replaceState(`${PATHS.departments.main}/${departmentId}`);
    }

}
