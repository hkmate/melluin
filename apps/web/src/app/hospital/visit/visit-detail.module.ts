import {NgModule} from '@angular/core';
import {VisitDetailsComponent} from '@fe/app/hospital/visit/visit-details/visit-details.component';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {VisitPresenterComponent} from '@fe/app/hospital/visit/visit-details/visit-presenter/visit-presenter.component';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {PersonNamePipe} from '@fe/app/people/person-name.pipe';
import {MatButtonModule} from '@angular/material/button';
import {VisitStatusIconComponent} from './visit-status-icon/visit-status-icon.component';
import {VisitFormComponent} from '@fe/app/hospital/visit/visit-details/visit-form/visit-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import {MinToHourPipe} from '@fe/app/util/min-to-hour.pipe';
import {OptionalPipe} from '@fe/app/util/optional.pipe';
import {VisitActivityModule} from '@fe/app/hospital/visit-activity/visit-activity.module';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {PersonSelectModule} from '@fe/app/util/person-select/person-select.module';
import {CopierComponent} from '@fe/app/util/copier/copier.component';
import {VisitConnectionsComponent} from '@fe/app/hospital/visit/visit-details/visit-connections/visit-connections.component';
import {VisitConnectedVisitComponent} from '@fe/app/hospital/visit/visit-details/visit-connections/visit-connected-visit/visit-connected-visit.component';
import {VisitConnectionCreateComponent} from '@fe/app/hospital/visit/visit-details/visit-connections/visit-connection-create/visit-connection-create.component';

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
        MatIconModule,

        TranslateModule,

        PersonNamePipe,
        VisitStatusIconComponent,
        MinToHourPipe,
        OptionalPipe,
        VisitActivityModule,
        PersonSelectModule,
        CopierComponent,
        VisitConnectedVisitComponent,
        VisitConnectionCreateComponent
    ],
    declarations: [
        VisitDetailsComponent,
        VisitPresenterComponent,
        VisitFormComponent,
        VisitConnectionsComponent
    ]
})
export class VisitDetailModule {
}
