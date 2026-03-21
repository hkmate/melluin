import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthGuardFn} from '@fe/app/auth/service/auth.guard';
import {VisitDetailsComponent} from '@fe/app/hospital/visit/visit-details/visit-details.component';
import {VisitResolver} from '@fe/app/hospital/visit/visit.resolver';
import {PATHS} from '@fe/app/app-paths';
import {Permission} from '@melluin/common';
import {VisitActivityFillerComponent} from '@fe/app/hospital/visit-activity-filler/visit-activity-filler.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: PATHS.visit.detail,
                canMatch: [AuthGuardFn],
                data: {
                    permissions: [Permission.canReadVisit]
                },
                providers: [VisitResolver],
                resolve: {visit: VisitResolver},
                component: VisitDetailsComponent,
            },
            {
                path: `${PATHS.visit.detail}/${PATHS.visit.fillActivities}`,
                canMatch: [AuthGuardFn],
                data: {
                    permissions: [Permission.canCreateActivity, Permission.canWriteActivityAtAnyVisit]
                },
                providers: [VisitResolver],
                resolve: {visit: VisitResolver},
                component: VisitActivityFillerComponent
            }
        ])
    ],
    exports: [RouterModule]
})
export default class VisitRoutingModule {
}
