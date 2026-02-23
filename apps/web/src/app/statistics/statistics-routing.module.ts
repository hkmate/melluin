import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthGuardFn} from '@fe/app/auth/service/auth.guard';
import {Permission} from '@melluin/common';
import {StatisticsLayoutComponent} from '@fe/app/statistics/statistics-layout/statistics-layout.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                canMatch: [AuthGuardFn],
                data: {
                    permissions: [Permission.canReadStatistics]
                },
                component: StatisticsLayoutComponent,
            }
        ]),
    ],
    exports: [RouterModule]
})
export default class StatisticsRoutingModule {
}
