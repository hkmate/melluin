import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthGuardFn} from '@fe/app/auth/service/auth.guard';
import {MyProfileComponent} from '@fe/app/my-profile/my-profile.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                canMatch: [AuthGuardFn],
                component: MyProfileComponent,
            }
        ]),
    ],
    exports: [RouterModule]
})
export default class MyProfileRoutingModule {
}
