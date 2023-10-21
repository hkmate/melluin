import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChildModule} from '@fe/app/hospital/child/child.module';
import {VisitActivitiesComponent} from './visit-activities/visit-activities.component';
import {TranslateModule} from '@ngx-translate/core';
import {DepartmentBoxModule} from '@fe/app/hospital/department-box/department-box.module';
import {MatIconModule} from '@angular/material/icon';
import {VisitActivityCardComponent} from './visit-activity-card/visit-activity-card.component';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {VisitActivitiesListComponent} from './visit-activities-list/visit-activities-list.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {PersonNamePipe} from '@fe/app/people/person-name.pipe';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,

        MatIconModule,
        MatCardModule,
        MatChipsModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        TranslateModule,

        ChildModule,
        DepartmentBoxModule,
        PersonNamePipe
    ],
    declarations: [
        VisitActivitiesComponent,
        VisitActivityCardComponent,
        VisitActivitiesListComponent,
    ],
    exports: [
        VisitActivitiesComponent
    ]
})
export class VisitActivityModule {
}
