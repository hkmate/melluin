import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PeopleModule} from '@fe/app/people/people.module';
import {AuthGuardFn} from '@fe/app/auth/service/auth.guard';
import {PeopleListComponent} from '@fe/app/people/people-list/people-list.component';
import {PersonDetailComponent} from '@fe/app/people/person-detail/person-detail.component';
import {PersonResolver} from '@fe/app/people/person.resolver';
import {PATHS} from '@fe/app/app-paths';
import {Permission} from '@shared/user/permission.enum';

const routes: Routes = [
    {
        path: '',
        canMatch: [AuthGuardFn],
        data: {
            permissions: [Permission.canSearchPerson]
        },
        component: PeopleListComponent,
    }, {
        path: PATHS.people.detail,
        canMatch: [AuthGuardFn],
        data: {
            permissions: [Permission.canReadPerson]
        },
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
