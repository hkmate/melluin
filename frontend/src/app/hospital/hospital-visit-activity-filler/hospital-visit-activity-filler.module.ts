import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import {TranslateModule} from '@ngx-translate/core';
import {VisitActivityModule} from '@fe/app/hospital/visit-activity/visit-activity.module';
import {HospitalEventCardModule} from '@fe/app/hospital/visit/hospital-event-card/hospital-event-card.module';
import {HospitalVisitActivityFillerComponent} from '@fe/app/hospital/hospital-visit-activity-filler/hospital-visit-activity-filler.component';
import {ChildFillerListComponent} from './fillers/child-filler-list/child-filler-list.component';
import {HospitalVisitActivityFillerService} from '@fe/app/hospital/hospital-visit-activity-filler/hospital-visit-activity-filler.service';
import {MatIconModule} from '@angular/material/icon';
import {FillerChildCreateComponent} from '@fe/app/hospital/hospital-visit-activity-filler/fillers/child-filler-list/filler-child-create/filler-child-create.component';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FillerChildCardComponent} from '@fe/app/hospital/hospital-visit-activity-filler/fillers/child-filler-list/filler-child-card/filler-child-card.component';
import {FillerChildItemComponent} from './fillers/child-filler-list/filler-child-item/filler-child-item.component';
import {FillerChildEditorComponent} from '@fe/app/hospital/hospital-visit-activity-filler/fillers/child-filler-list/filler-child-editor/filler-child-editor.component';
import {DepartmentBoxModule} from '@fe/app/hospital/department-box/department-box.module';
import {RelatedVisitListComponent} from '@fe/app/hospital/hospital-visit-activity-filler/related-activities/related-visit-list/related-visit-list.component';
import {RelatedVisitComponent} from '@fe/app/hospital/hospital-visit-activity-filler/related-activities/related-visit/related-visit.component';
import {ChildModule} from '@fe/app/hospital/child/child.module';
import {RelatedVisitChildComponent} from './related-activities/related-visit-child/related-visit-child.component';
import {PersonNamePipe} from '@fe/app/people/person-name.pipe';
import {RelatedActivityComponent} from './related-activities/related-activity/related-activity.component';
import {MatChipsModule} from '@angular/material/chips';
import {ActivityFillerListComponent} from './fillers/activity-filler-list/activity-filler-list.component';
import {FillerActivityCreateComponent} from './fillers/activity-filler-list/filler-activity-create/filler-activity-create.component';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {FillerActivityItemComponent} from './fillers/activity-filler-list/filler-activity-item/filler-activity-item.component';
import {FillerActivityCardComponent} from './fillers/activity-filler-list/filler-activity-card/filler-activity-card.component';
import {FillerActivityEditorComponent} from './fillers/activity-filler-list/filler-activity-editor/filler-activity-editor.component';
import {ChildSelectModule} from '@fe/app/hospital/child/child-select/child-select.module';
import {ActivitySelectModule} from '@fe/app/hospital/visit-activity/activity-select/activity-select.module';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {TrimmedTextInputModule} from '@fe/app/util/trimmed-text-input/trimmed-text-input.module';
import {ActivitiesInformationFillerComponent} from '@fe/app/hospital/hospital-visit-activity-filler/fillers/activities-information-filler/activities-information-filler.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,

        MatButtonModule,
        MatExpansionModule,
        MatIconModule,
        MatCardModule,
        MatInputModule,
        MatChipsModule,
        MatOptionModule,
        MatSelectModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        ScrollingModule,

        TranslateModule,

        VisitActivityModule,
        HospitalEventCardModule,
        DepartmentBoxModule,
        ChildModule,
        PersonNamePipe,
        ChildSelectModule,
        ActivitySelectModule,
        TrimmedTextInputModule
    ],
    declarations: [
        HospitalVisitActivityFillerComponent,
        RelatedVisitListComponent,
        ChildFillerListComponent,
        FillerChildCreateComponent,
        FillerChildCardComponent,
        FillerChildItemComponent,
        FillerChildEditorComponent,
        RelatedVisitComponent,
        RelatedVisitChildComponent,
        RelatedActivityComponent,
        ActivityFillerListComponent,
        FillerActivityCreateComponent,
        FillerActivityItemComponent,
        FillerActivityCardComponent,
        FillerActivityEditorComponent,
        ActivitiesInformationFillerComponent,
    ],
    providers: [
        HospitalVisitActivityFillerService
    ]
})
export class HospitalVisitActivityFillerModule {
}
