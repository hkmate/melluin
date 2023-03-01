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
import {HospitalVisitFormComponent} from './hospital-visit-details/hospital-visit-form/hospital-visit-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MinToHourPipe} from '@fe/app/util/min-to-hour.pipe';
import {OptionalPipe} from '@fe/app/util/optional.pipe';
import {VisitActivityModule} from '@fe/app/hospital/visit-activity/visit-activity.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,

        MatCardModule,
        MatChipsModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule,
        TranslateModule,

        PersonNamePipe,
        VisitStatusIconComponent,
        MinToHourPipe,
        OptionalPipe,
        VisitActivityModule,
    ],
    declarations: [
        HospitalVisitDetailsComponent,
        HospitalVisitPresenterComponent,
        HospitalVisitFormComponent
    ]
})
export class HospitalVisitDetailModule {
}
