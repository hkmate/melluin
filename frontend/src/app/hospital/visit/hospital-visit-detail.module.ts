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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MinToHourPipe} from '@fe/app/util/min-to-hour.pipe';
import {OptionalPipe} from '@fe/app/util/optional.pipe';
import {VisitActivityModule} from '@fe/app/hospital/visit-activity/visit-activity.module';
import {HospitalVisitActivityFillerComponent} from './hospital-visit-activity-filler/hospital-visit-activity-filler.component';
import {HospitalEventCardModule} from '@fe/app/hospital/visit/hospital-event-card/hospital-event-card.module';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,

        MatCardModule,
        MatChipsModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatExpansionModule,
        MatNativeDateModule,
        MatIconModule,
        TranslateModule,

        PersonNamePipe,
        VisitStatusIconComponent,
        MinToHourPipe,
        OptionalPipe,
        VisitActivityModule,
        HospitalEventCardModule,
    ],
    declarations: [
        HospitalVisitDetailsComponent,
        HospitalVisitPresenterComponent,
        HospitalVisitFormComponent,
        HospitalVisitActivityFillerComponent
    ]
})
export class HospitalVisitDetailModule {
}
