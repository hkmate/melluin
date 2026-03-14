import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthGuardFn} from '@fe/app/auth/service/auth.guard';
import {PATHS} from '@fe/app/app-paths';
import {DepartmentResolver} from '@fe/app/hospital/department/department-detail/department.resolver';
import {DepartmentDetailComponent} from '@fe/app/hospital/department/department-detail/department-detail.component';
import {DepartmentsListComponent} from '@fe/app/hospital/department/departments-list/departments-list.component';
import {Permission} from '@melluin/common';

const routes: Routes = [
    {
        path: '',
        canMatch: [AuthGuardFn],
        data: {
            permissions: [Permission.canSearchDepartment]
        },
        component: DepartmentsListComponent,
    }, {
        path: PATHS.departments.detail,
        canMatch: [AuthGuardFn],
        component: DepartmentDetailComponent,
        data: {
            permissions: [Permission.canReadDepartment]
        },
        providers: [DepartmentResolver],
        resolve: {department: DepartmentResolver}
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
})
export default class DepartmentRoutingModule {
}
