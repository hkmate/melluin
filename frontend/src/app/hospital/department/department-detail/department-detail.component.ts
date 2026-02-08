import {Component, computed, inject, signal} from '@angular/core';
import {Observable, tap} from 'rxjs';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {RouteDataHandler} from '@fe/app/util/route-data-handler/route-data-handler';
import {CREATE_MARKER, CreateMarkerType, PATHS} from '@fe/app/app-paths';
import {Department} from '@shared/department/department';
import {DepartmentCreation} from '@shared/department/department-creation';
import {DepartmentUpdateChangeSet} from '@shared/department/department-update-change-set';
import {DepartmentService} from '@fe/app/hospital/department/department.service';
import {isNil} from '@shared/util/util';
import {Permission} from '@shared/user/permission.enum';
import {DateUtil} from '@shared/util/date-util';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {MessageService} from '@fe/app/util/message.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-department-detail',
    templateUrl: './department-detail.component.html',
    styleUrls: ['./department-detail.component.scss'],
    providers: [RouteDataHandler]
})
export class DepartmentDetailComponent {

    private readonly router = inject(Router);
    private readonly location = inject(Location);
    private readonly msg = inject(MessageService);
    private readonly route = inject(RouteDataHandler);
    private readonly permissions = inject(PermissionService);
    private readonly departmentService = inject(DepartmentService);

    protected isEditMode = computed(() => this.isEdit() || this.isCreation());
    protected department?: Department;

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

    protected saveDepartment(data: DepartmentUpdateChangeSet | DepartmentCreation): void {
        this.createSaveRequest(data).subscribe(department => {
            this.department = department;
            this.msg.success('SaveSuccessful');
            this.setToPresent();
        });
    }

    protected cancelEditing(): void {
        if (this.isCreation()) {
            this.router.navigate([PATHS.people.main]);
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
        return this.permissions.has(Permission.canWriteDepartment)
            && (isNil(this.department?.validTo)
                || this.now < this.department!.validTo);
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
        this.department = departmentInfo;
        if (this.route.getParam('edit') === 'true') {
            this.switchToEdit();
        }
    }

    private createSaveRequest(data: DepartmentCreation | DepartmentUpdateChangeSet): Observable<Department> {
        if (this.isCreation()) {
            return this.departmentService.addDepartment(data as DepartmentCreation)
                .pipe(tap(department => this.setIdInUrl(department.id)));
        }
        return this.departmentService.updateDepartment(this.department!.id, data as DepartmentUpdateChangeSet);
    }

    private setIdInUrl(departmentId: string): void {
        this.location.replaceState(`${PATHS.hospitalDepartments.main}/${departmentId}`);
    }


}
