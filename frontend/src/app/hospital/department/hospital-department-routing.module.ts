import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthGuard} from '@fe/app/auth/service/auth.guard';
import {PeopleListComponent} from '@fe/app/people/people-list/people-list.component';
import {PATHS} from '@fe/app/app-paths';
import {DepartmentResolver} from '@fe/app/hospital/department/department-detail/department.resolver';
import {DepartmentDetailComponent} from '@fe/app/hospital/department/department-detail/department-detail.component';
import {HospitalDepartmentModule} from '@fe/app/hospital/department/hospital-department.module';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: PeopleListComponent,
    }, {
        path: PATHS.hospitalDepartments.detail,
        canActivate: [AuthGuard],
        component: DepartmentDetailComponent,
        resolve: {department: DepartmentResolver}
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),

        HospitalDepartmentModule
    ],
    exports: [RouterModule]
})
export class HospitalDepartmentRoutingModule {
}
