import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {HospitalEventsListComponent} from '@fe/app/hospital/visit/hospital-events-list/hospital-events-list.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {OptionalPipe} from '@fe/app/util/optional.pipe';
import {PersonNamePipe} from '@fe/app/people/person-name.pipe';
import {TranslateModule} from '@ngx-translate/core';
import {VisitStatusIconComponent} from '@fe/app/hospital/visit/visit-status-icon/visit-status-icon.component';
import {MatTooltip} from '@angular/material/tooltip';


@NgModule({
    imports: [
        CommonModule,
        RouterModule,

        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatTooltip,
        TranslateModule,

        OptionalPipe,
        PersonNamePipe,
        VisitStatusIconComponent,
    ],
    declarations: [
        HospitalEventsListComponent
    ],
    exports: [
        HospitalEventsListComponent
    ]
})
export class HospitalEventsListModule {
}
