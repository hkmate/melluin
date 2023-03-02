import {NgModule} from '@angular/core';
import {HospitalEventCardComponent} from '@fe/app/hospital/visit/hospital-event-card/hospital-event-card.component';
import {MatCardModule} from '@angular/material/card';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatChipsModule} from '@angular/material/chips';
import {PersonNamePipe} from '@fe/app/people/person-name.pipe';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
    imports: [
        CommonModule,
        RouterModule,

        MatCardModule,
        MatChipsModule,
        MatIconModule,
        TranslateModule,

        PersonNamePipe
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
