import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthGuardFn} from '@fe/app/auth/service/auth.guard';
import {MyProfileModule} from '@fe/app/my-profile/my-profile.module';
import {MyProfileComponent} from '@fe/app/my-profile/my-profile.component';

const routes: Routes = [
    {
        path: '',
        canMatch: [AuthGuardFn],
        component: MyProfileComponent,
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),

        MyProfileModule
    ],
    exports: [RouterModule]
})
export default class MyProfileRoutingModule {
}
