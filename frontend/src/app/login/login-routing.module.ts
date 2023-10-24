import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login.component';
import {LoginModule} from './login.module';

const routes: Routes = [
    {
        path: '',
        component: LoginComponent,
        data: {titleKey: 'Titles.Login'}
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),

        LoginModule
    ],
    exports: [RouterModule]
})
export class LoginRoutingModule {
}
