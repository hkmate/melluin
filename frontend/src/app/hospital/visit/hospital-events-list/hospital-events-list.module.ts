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


@NgModule({
    imports: [
        CommonModule,
        RouterModule,

        MatButtonModule,
        MatIconModule,
        MatTableModule,
        TranslateModule,

        OptionalPipe,
        PersonNamePipe,
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
