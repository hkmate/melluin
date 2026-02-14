import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TrimmedTextInputComponent} from '@fe/app/util/trimmed-text-input/trimmed-text-input.component';
import {MatInputModule} from '@angular/material/input';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,

        MatInputModule
    ],
    declarations: [TrimmedTextInputComponent],
    exports: [TrimmedTextInputComponent]
})
export class TrimmedTextInputModule {
}
