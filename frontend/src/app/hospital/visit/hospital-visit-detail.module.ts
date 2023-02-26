import {NgModule} from '@angular/core';
import {HospitalVisitDetailsComponent} from './hospital-visit-details/hospital-visit-details.component';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {HospitalVisitPresenterComponent} from './hospital-visit-details/hospital-visit-presenter/hospital-visit-presenter.component';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {PersonNamePipe} from '@fe/app/people/person-name.pipe';
import {MatButtonModule} from '@angular/material/button';
import {VisitStatusIconComponent} from './visit-status-icon/visit-status-icon.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,

        MatCardModule,
        MatChipsModule,
        MatButtonModule,
        TranslateModule,

        PersonNamePipe,
        VisitStatusIconComponent
    ],
    declarations: [
        HospitalVisitDetailsComponent,
        HospitalVisitPresenterComponent
    ]
})
export class HospitalVisitDetailModule {
}
