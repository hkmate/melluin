import {NgModule} from '@angular/core';
import {PeopleListComponent} from '@fe/app/people/people-list/people-list.component';
import {TranslateModule} from '@ngx-translate/core';
import {PersonNamePipe} from './person-name.pipe';
import {OptionalPipe} from '@fe/app/util/optional.pipe';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {LazyInputModule} from '@fe/app/util/lazy-input/lazy-input.module';

@NgModule({
    imports: [
        CommonModule,

        MatTableModule,
        MatPaginatorModule,
        TranslateModule,

        PersonNamePipe,
        OptionalPipe,
        LazyInputModule,
    ],
    declarations: [
        PeopleListComponent
    ],
    exports: [
        PeopleListComponent
    ]
})
export class PeopleModule {
}
