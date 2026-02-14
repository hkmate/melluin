import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PATHS} from './app-paths';
import {AuthGuardFn} from './auth/service/auth.guard';
import {NotFoundComponent} from './not-found-component/not-found.component';
import {PathResolveService} from './path-resolve/path-resolve.service';
import {DashboardComponent} from './dashboard/dashboard.component';
import {Permission} from '@shared/user/permission.enum';
import {NavigatorComponent} from '@fe/app/navigator.component';

const routes: Routes = [
    {
        path: PATHS.login.main,
        loadChildren: () => import('./login/login-routing.module')
    },
    {
        path: PATHS.dashboard.main,
        canMatch: [AuthGuardFn],
        component: DashboardComponent
    },
    {
        path: PATHS.people.main,
        canMatch: [AuthGuardFn],
        data: {
            permissions: [Permission.canSearchPerson, Permission.canReadPerson]
        },
        loadChildren: () => import('./people/people-routing.module')
    },
    {
        path: PATHS.myProfile.main,
        canMatch: [AuthGuardFn],
        loadChildren: () => import('./my-profile/my-profile-routing.module')
    },
    {
        path: PATHS.hospitalDepartments.main,
        canMatch: [AuthGuardFn],
        data: {
            permissions: [Permission.canSearchDepartment]
        },
        loadChildren: () => import('./hospital/department/hospital-department-routing.module')
    },
    {
        path: PATHS.events.main,
        canMatch: [AuthGuardFn],
        data: {
            permissions: [Permission.canReadVisit]
        },
        loadChildren: () => import('./events/events-routing.module')
    },
    {
        path: PATHS.hospitalVisit.main,
        canMatch: [AuthGuardFn],
        data: {
            permissions: [Permission.canReadVisit]
        },
        loadChildren: () => import('./hospital/hospital-visit-routing.module')
    },
    {
        path: PATHS.statistics.main,
        loadChildren: () => import('./statistics/statistics-routing.module')
    },
    {
        path: PATHS.sysadmin.main,
        loadChildren: () => import('./sysadmin/sysadmin-routing.module')
    },
    {
        path: PATHS.questionnaire.main,
        loadChildren: () => import('./questionnaire/questionnaire-routing.module')
    },
    {
        path: '',
        canMatch: [AuthGuardFn],
        component: NavigatorComponent
    },
    {path: '**', resolve: {path: PathResolveService}, component: NotFoundComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
