import {NgModule} from '@angular/core';
import {DepartmentBoxInfoComponent} from './department-box-info/department-box-info.component';
import {MatCardModule} from '@angular/material/card';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import { DepartmentBoxInfoListComponent } from './department-box-info-list/department-box-info-list.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { DepartmentBoxInfoCreateComponent } from './department-box-info-create/department-box-info-create.component';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { DepartmentBoxInfoManagerComponent } from './department-box-info-manager/department-box-info-manager.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
    imports: [
        CommonModule,

        MatCardModule,
        MatPaginatorModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatIconModule,
        MatButtonModule,
        TranslateModule,
    ],
    exports: [
        DepartmentBoxInfoListComponent,
        DepartmentBoxInfoManagerComponent
    ],
    declarations: [
        DepartmentBoxInfoComponent,
        DepartmentBoxInfoListComponent,
        DepartmentBoxInfoCreateComponent,
        DepartmentBoxInfoManagerComponent
    ]
})
export class DepartmentBoxModule {

}
