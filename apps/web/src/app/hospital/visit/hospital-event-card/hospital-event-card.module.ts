import {NgModule} from '@angular/core';
import {HospitalEventCardComponent} from '@fe/app/hospital/visit/hospital-event-card/hospital-event-card.component';
import {MatCardModule} from '@angular/material/card';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatChipsModule} from '@angular/material/chips';
import {PersonNamePipe} from '@fe/app/people/person-name.pipe';
import {MatIconModule} from '@angular/material/icon';
import {VisitStatusIconComponent} from '@fe/app/hospital/visit/visit-status-icon/visit-status-icon.component';


@NgModule({
    imports: [
        CommonModule,
        RouterModule,

        MatCardModule,
        MatChipsModule,
        MatIconModule,

        TranslateModule,

        PersonNamePipe,
        VisitStatusIconComponent
    ],
    declarations: [
        HospitalEventCardComponent
    ],
    exports: [
        HospitalEventCardComponent
    ]
})
export class HospitalEventCardModule {
}
