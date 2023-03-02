import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChildModule} from '@fe/app/hospital/child/child.module';
import {VisitActivitiesComponent} from './visit-activities/visit-activities.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {TranslateModule} from '@ngx-translate/core';
import {DepartmentBoxModule} from '@fe/app/hospital/department-box/department-box.module';
import {MatIconModule} from '@angular/material/icon';
import {VisitActivityCardComponent} from './visit-activity-card/visit-activity-card.component';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {VisitActivitiesListComponent} from './visit-activities-list/visit-activities-list.component';
import {VisitActivityCreateComponent} from './visit-activitiy-create/visit-activity-create.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {VisitActivityManagerComponent} from './visit-activity-manager/visit-activity-manager.component';
import {MatButtonModule} from '@angular/material/button';
import { VisitRelatedActivitiesComponent } from './visit-related-activities/visit-related-activities.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,

        MatExpansionModule,
        MatIconModule,
        MatCardModule,
        MatChipsModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        TranslateModule,

        ChildModule,
        DepartmentBoxModule,
    ],
    declarations: [
        VisitActivitiesComponent,
        VisitActivityCardComponent,
        VisitActivitiesListComponent,
        VisitActivityCreateComponent,
        VisitActivityManagerComponent,
        VisitRelatedActivitiesComponent
    ],
    exports: [
        VisitActivitiesComponent,
        VisitRelatedActivitiesComponent
    ]
})
export class VisitActivityModule {
}
