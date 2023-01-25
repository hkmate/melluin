import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PeopleModule} from '@fe/app/people/people.module';
import {AuthGuard} from '@fe/app/auth/service/auth.guard';
import {foundationEmployeeRoles} from '@shared/user/role.enum';
import {PeopleListComponent} from '@fe/app/people/people-list/people-list.component';
import {PersonDetailComponent} from '@fe/app/people/person-detail/person-detail.component';
import {PersonResolver} from '@fe/app/people/person.resolver';
import {PATHS} from '@fe/app/app-paths';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        data: {roles: foundationEmployeeRoles},
        component: PeopleListComponent,
    }, {
        path: PATHS.people.detail,
        canActivate: [AuthGuard],
        data: {roles: foundationEmployeeRoles},
        component: PersonDetailComponent,
        resolve: {person: PersonResolver}
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),

        PeopleModule
    ],
    exports: [RouterModule]
})
export class PeopleRoutingModule {
}
