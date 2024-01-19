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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {RouterModule} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {PersonDataPresenterComponent} from './person-detail/person-data-persenter/person-data-presenter.component';
import {MatCardModule} from '@angular/material/card';
import {UserDetailComponent} from './person-detail/user-detail/user-detail.component';
import {UserDataPresenterComponent} from './person-detail/user-data-presenter/user-data-presenter.component';
import {UserCreationFormComponent} from './person-detail/user-creation-form/user-creation-form.component';
import {MatSelectModule} from '@angular/material/select';
import {UserEditFormComponent} from './person-detail/user-edit-form/user-edit-form.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {TrimmedTextInputModule} from '@fe/app/util/trimmed-text-input/trimmed-text-input.module';
import {PeopleListFilterComponent} from '@fe/app/people/people-list/people-list-filter/people-list-filter.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {PersonSelectModule} from '@fe/app/util/person-select/person-select.module';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,

        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatTableModule,
        MatPaginatorModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatExpansionModule,
        MatCheckboxModule,
        MatDatepickerModule,

        TranslateModule,

        PersonNamePipe,
        OptionalPipe,
        LazyInputModule,
        TrimmedTextInputModule,
        PersonSelectModule
    ],
    declarations: [
        PeopleListComponent,
        PersonDetailComponent,
        PersonDataFormComponent,
        PersonDataPresenterComponent,
        UserDetailComponent,
        UserDataPresenterComponent,
        UserCreationFormComponent,
        UserEditFormComponent,
        PeopleListFilterComponent
    ]
})
export class PeopleModule {
}
