import {Routes} from '@angular/router';
import {PATHS} from './app-paths';
import {AuthGuardFn} from './auth/service/auth.guard';
import {PathResolveService} from './path-resolve/path-resolve.service';
import {Permission} from '@melluin/common';
import {NavigatorComponent} from '@fe/app/navigator.component';

export const routes: Routes = [
    {
        path: PATHS.login.main,
        loadChildren: () => import('./login/login-routing.module')
    },
    {
        path: PATHS.dashboard.main,
        canMatch: [AuthGuardFn],
        loadComponent: () => import('./dashboard/dashboard.component')
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
        path: PATHS.departments.main,
        canMatch: [AuthGuardFn],
        data: {
            permissions: [Permission.canSearchDepartment]
        },
        loadChildren: () => import('./hospital/department/department-routing.module')
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
        path: PATHS.visit.main,
        canMatch: [AuthGuardFn],
        data: {
            permissions: [Permission.canReadVisit]
        },
        loadChildren: () => import('./hospital/visit-routing.module')
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
    {
        path: '**',
        resolve: {path: PathResolveService},
        loadComponent: () => import('./not-found-component/not-found.component')
    }
];
