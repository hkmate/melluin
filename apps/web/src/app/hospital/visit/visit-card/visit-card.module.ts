import {NgModule} from '@angular/core';
import {VisitCardComponent} from '@fe/app/hospital/visit/visit-card/visit-card.component';
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
        VisitCardComponent
    ],
    exports: [
        VisitCardComponent
    ]
})
export class VisitCardModule {
}
