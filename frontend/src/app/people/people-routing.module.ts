import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PeopleModule} from '@fe/app/people/people.module';
import {AuthGuard} from '@fe/app/auth/service/auth.guard';
import {foundationEmployeeRoles} from '@shared/user/role.enum';
import {PeopleListComponent} from '@fe/app/people/people-list/people-list.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        data: {roles: foundationEmployeeRoles},
        component: PeopleListComponent,
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
