import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PATHS} from './app-paths';
import {AuthGuard} from './auth/service/auth.guard';
import {NotFoundComponent} from './not-found-component/not-found.component';
import {PathResolveService} from './path-resolve/path-resolve.service';
import {DashboardComponent} from './dashboard/dashboard.component';
import {Permission} from '@shared/user/permission.enum';

const routes: Routes = [
    {
        path: PATHS.login.main,
        loadChildren: () => import('./login/login-routing.module').then(m => m.LoginRoutingModule)
    },
    {
        path: PATHS.dashboard.main,
        canActivate: [AuthGuard],
        component: DashboardComponent
    },
    {
        path: PATHS.people.main,
        canLoad: [AuthGuard],
        data: {
            permissions: [Permission.canSearchPerson, Permission.canReadPerson]
        },
        loadChildren: () => import('./people/people-routing.module').then(m => m.PeopleRoutingModule)
    },
    {
        path: PATHS.myProfile.main,
        canLoad: [AuthGuard],
        loadChildren: () => import('./my-profile/my-profile-routing.module').then(m => m.MyProfileRoutingModule)
    },
    {
        path: PATHS.hospitalDepartments.main,
        canLoad: [AuthGuard],
        data: {
            permissions: [Permission.canSearchDepartment]
        },
        loadChildren: () => import('./hospital/department/hospital-department-routing.module').then(m => m.HospitalDepartmentRoutingModule)
    },
    {
        path: PATHS.events.main,
        canLoad: [AuthGuard],
        data: {
            permissions: [Permission.canReadVisit]
        },
        loadChildren: () => import('./events/events-routing.module').then(m => m.EventsRoutingModule)
    },
    {
        path: PATHS.hospitalVisit.main,
        canLoad: [AuthGuard],
        data: {
            permissions: [Permission.canReadVisit]
        },
        loadChildren: () => import('./hospital/hospital-visit-routing.module').then(m => m.HospitalVisitRoutingModule)
    },
    {
        path: '',
        redirectTo: PATHS.events.main,
        pathMatch: 'full'
    },
    {path: '**', resolve: {path: PathResolveService}, component: NotFoundComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
