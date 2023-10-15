import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ChildSelectComponent} from './child-select.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,

        MatChipsModule,
        MatFormFieldModule,
        MatIconModule,
        MatOptionModule,
        MatSelectModule
    ],
    declarations: [
        ChildSelectComponent
    ],
    exports: [
        ChildSelectComponent
    ]
})
export class ChildSelectModule {
}
