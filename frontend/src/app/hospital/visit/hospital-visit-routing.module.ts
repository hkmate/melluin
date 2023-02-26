import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthGuard} from '@fe/app/auth/service/auth.guard';
import {HospitalVisitDetailsComponent} from '@fe/app/hospital/visit/hospital-visit-details/hospital-visit-details.component';
import {HospitalVisitDetailModule} from '@fe/app/hospital/visit/hospital-visit-detail.module';
import {HospitalVisitResolver} from '@fe/app/hospital/visit/hospital-visit.resolver';

const routes: Routes = [
    {
        path: ':id',
        canActivate: [AuthGuard],
        resolve: {visit: HospitalVisitResolver},
        component: HospitalVisitDetailsComponent,
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),

        HospitalVisitDetailModule
    ],
    exports: [RouterModule]
})
export class HospitalVisitRoutingModule {
}
