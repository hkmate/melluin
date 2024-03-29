import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthGuardFn} from '@fe/app/auth/service/auth.guard';
import {HospitalVisitDetailsComponent} from '@fe/app/hospital/visit/hospital-visit-details/hospital-visit-details.component';
import {HospitalVisitDetailModule} from '@fe/app/hospital/visit/hospital-visit-detail.module';
import {HospitalVisitResolver} from '@fe/app/hospital/visit/hospital-visit.resolver';
import {PATHS} from '@fe/app/app-paths';
import {Permission} from '@shared/user/permission.enum';
import {HospitalVisitActivityFillerComponent} from '@fe/app/hospital/hospital-visit-activity-filler/hospital-visit-activity-filler.component';
import {HospitalVisitActivityFillerModule} from '@fe/app/hospital/hospital-visit-activity-filler/hospital-visit-activity-filler.module';

const routes: Routes = [
    {
        path: PATHS.hospitalVisit.detail,
        canMatch: [AuthGuardFn],
        data: {
            permissions: [Permission.canReadVisit]
        },
        resolve: {visit: HospitalVisitResolver},
        component: HospitalVisitDetailsComponent,
    },
    {
        path: `${PATHS.hospitalVisit.detail}/${PATHS.hospitalVisit.fillActivities}`,
        canMatch: [AuthGuardFn],
        data: {
            permissions: [Permission.canCreateActivity]
        },
        resolve: {visit: HospitalVisitResolver},
        component: HospitalVisitActivityFillerComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),

        HospitalVisitDetailModule,
        HospitalVisitActivityFillerModule
    ],
    exports: [RouterModule]
})
export class HospitalVisitRoutingModule {
}
