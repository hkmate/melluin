import {NgModule} from '@angular/core';
import {DepartmentDetailComponent} from '@fe/app/hospital/department/department-detail/department-detail.component';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {DepartmentDataPresenterComponent} from '@fe/app/hospital/department/department-detail/department-data-persenter/department-data-presenter.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {TranslateModule} from '@ngx-translate/core';
import {PersonNamePipe} from '@fe/app/people/person-name.pipe';
import {OptionalPipe} from '@fe/app/util/optional.pipe';
import {LazyInputModule} from '@fe/app/util/lazy-input/lazy-input.module';
import {DepartmentDataFormComponent} from '@fe/app/hospital/department/department-detail/department-data-form/department-data-form.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';


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
        MatSelectModule,
        MatSlideToggleModule,
        MatNativeDateModule,
        MatDatepickerModule,
        TranslateModule,

        PersonNamePipe,
        OptionalPipe,
        LazyInputModule,
    ],
    declarations: [
        DepartmentDetailComponent,
        DepartmentDataPresenterComponent,
        DepartmentDataFormComponent
    ]
})
export class HospitalDepartmentModule {
}
