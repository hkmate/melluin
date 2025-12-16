import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthGuardFn} from '@fe/app/auth/service/auth.guard';
import {Permission} from '@shared/user/permission.enum';
import {SysadminModule} from '@fe/app/sysadmin/sysadmin.module';
import {RoleSettingsComponent} from '@fe/app/sysadmin/role-settings/role-settings.component';
import {PATHS} from '@fe/app/app-paths';

const routes: Routes = [
    {
        path: PATHS.sysadmin.roles,
        canMatch: [AuthGuardFn],
        data: {
            permissions: [Permission.canManagePermissions]
        },
        component: RoleSettingsComponent,
    }, {
        path: '',
        pathMatch: 'full',
        redirectTo: PATHS.sysadmin.roles
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),

        SysadminModule
    ],
    exports: [RouterModule]
})
export default class SysadminRoutingModule {
}
