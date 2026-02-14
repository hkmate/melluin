import {NgModule} from '@angular/core';
import {LazyInputComponent} from '@fe/app/util/lazy-input/lazy-input.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,

        MatTableModule,
        MatPaginatorModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
    ],
    declarations: [LazyInputComponent],
    exports: [LazyInputComponent]
})
export class LazyInputModule {
}
