import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import {FormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {ActivitySelectComponent} from './activity-select.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,

        MatSelectModule,
        MatChipsModule,
        MatIconModule,

        TranslateModule
    ],
    declarations: [
        ActivitySelectComponent,
    ],
    exports: [
        ActivitySelectComponent
    ]
})
export class ActivitySelectModule {
}
