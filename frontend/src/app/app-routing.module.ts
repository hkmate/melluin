import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PATHS} from './app-paths';
import {AuthGuard} from './auth/service/auth.guard';
import {NotFoundComponent} from './not-found-component/not-found.component';
import {PathResolveService} from './path-resolve/path-resolve.service';
import {DashboardComponent} from './dashboard/dashboard.component';

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
        loadChildren: () => import('./people/people-routing.module').then(m => m.PeopleRoutingModule)
    },
    {
        path: '',
        redirectTo: PATHS.dashboard.main,
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
