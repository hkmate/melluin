import {NgModule} from '@angular/core';
import {PeopleListComponent} from '@fe/app/people/people-list/people-list.component';
import {TranslateModule} from '@ngx-translate/core';
import {PersonNamePipe} from './person-name.pipe';
import {OptionalPipe} from '@fe/app/util/optional.pipe';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {LazyInputModule} from '@fe/app/util/lazy-input/lazy-input.module';
import {PersonDetailComponent} from './person-detail/person-detail.component';
import {PersonDataFormComponent} from './person-detail/person-data-form/person-data-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {RouterModule} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { PersonDataPresenterComponent } from './person-detail/person-data-persenter/person-data-presenter.component';
import {MatCardModule} from '@angular/material/card';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,

        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatTableModule,
        MatPaginatorModule,
        TranslateModule,

        PersonNamePipe,
        OptionalPipe,
        LazyInputModule,
    ],
    declarations: [
        PeopleListComponent,
        PersonDetailComponent,
        PersonDataFormComponent,
        PersonDataPresenterComponent
    ],
    exports: [
        PeopleListComponent
    ]
})
export class PeopleModule {
}
