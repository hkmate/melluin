import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthGuardFn} from '@fe/app/auth/service/auth.guard';
import {Permission} from '@melluin/common';
import {RoleSettingsComponent} from '@fe/app/sysadmin/role-settings/role-settings.component';
import {PATHS} from '@fe/app/app-paths';

@NgModule({
    imports: [
        RouterModule.forChild([
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
        ]),
    ],
    exports: [RouterModule]
})
export default class SysadminRoutingModule {
}
