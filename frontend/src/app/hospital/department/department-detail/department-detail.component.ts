import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription, tap, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {RouteDataHandler} from '@fe/app/util/route-data-handler/route-data-handler';
import {CREATE_MARKER, CreateMarkerType, PATHS} from '@fe/app/app-paths';
import {Department} from '@shared/department/department';
import {DepartmentCreation} from '@shared/department/department-creation';
import {DepartmentUpdateChangeSet} from '@shared/department/department-update-change-set';
import {DepartmentService} from '@fe/app/hospital/department/department.service';
import {isNil} from '@shared/util/util';

@Component({
    selector: 'app-department-detail',
    templateUrl: './department-detail.component.html',
    styleUrls: ['./department-detail.component.scss'],
    providers: [RouteDataHandler]
})
export class DepartmentDetailComponent implements OnInit, OnDestroy {

    protected isCreation = false;
    protected isEdit = false;
    protected department?: Department;
    private resolverSubscription: Subscription;
    private now = new Date().toISOString();

    constructor(private readonly router: Router,
                private readonly location: Location,
                private readonly route: RouteDataHandler,
                private readonly departmentService: DepartmentService) {
    }

    public ngOnInit(): void {
        this.resolverSubscription = this.route.getData<Department | CreateMarkerType>('department').subscribe(
            departmentInfo => {
                this.setUp(departmentInfo);
            }
        );
    }

    public ngOnDestroy(): void {
        this.resolverSubscription?.unsubscribe();
    }

    protected isEditMode(): boolean {
        return this.isEdit || this.isCreation;
    }

    protected saveDepartment(data: DepartmentUpdateChangeSet | DepartmentCreation): void {
        this.createSaveRequest(data).subscribe(department => {
            this.department = department;
            this.setToPresent();
        });
    }

    protected cancelEditing(): void {
        if (this.isCreation) {
            this.router.navigate([PATHS.people.main]);
        }
        this.setToPresent();
    }

    protected switchToEdit(): void {
        if (!this.isEditEnabled()) {
            return;
        }
        this.isEdit = true;
        this.route.setParam('edit', true);
    }

    protected isEditEnabled(): boolean {
        return isNil(this.department?.validTo)
            || this.now < this.department!.validTo;
    }

    private setToPresent(): void {
        this.isEdit = false;
        this.isCreation = false;
        this.route.removeParam('edit');
    }

    private setUp(departmentInfo: Department | CreateMarkerType): void {
        if (departmentInfo === CREATE_MARKER) {
            this.isCreation = true;
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
        if (data instanceof DepartmentUpdateChangeSet) {
            return this.departmentService.updateDepartment(this.department!.id, data);
        }
        if (data instanceof DepartmentCreation) {
            return this.departmentService.addDepartment(data).pipe(tap(department => this.setIdInUrl(department.id)));
        }
        return throwError(() => new Error('Invalid data to save.'));
    }

    private setIdInUrl(departmentId: string): void {
        this.location.replaceState(`${PATHS.hospitalDepartments.main}/${departmentId}`);
    }


}
