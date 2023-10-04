import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {PersonSelectComponent} from '@fe/app/util/person-select/person-select.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {PersonNamePipe} from '@fe/app/people/person-name.pipe';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {MatIconModule} from '@angular/material/icon';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        MatInputModule,
        MatIconModule,
        MatChipsModule,
        MatOptionModule,
        MatSelectModule,
        NgxMatSelectSearchModule,

        TranslateModule,

        PersonNamePipe,
    ],
    declarations: [PersonSelectComponent],
    exports: [PersonSelectComponent]
})
export class PersonSelectModule {
}
