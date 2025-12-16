import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthGuardFn} from '@fe/app/auth/service/auth.guard';
import {Permission} from '@shared/user/permission.enum';
import {StatisticsModule} from '@fe/app/statistics/statistics.module';
import {StatisticsLayoutComponent} from '@fe/app/statistics/statistics-layout/statistics-layout.component';

const routes: Routes = [
    {
        path: '',
        canMatch: [AuthGuardFn],
        data: {
            permissions: [Permission.canReadStatistics]
        },
        component: StatisticsLayoutComponent,
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),

        StatisticsModule
    ],
    exports: [RouterModule]
})
export default class StatisticsRoutingModule {
}
