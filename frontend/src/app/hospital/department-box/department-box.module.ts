import {NgModule} from '@angular/core';
import {DepartmentBoxInfoComponent} from './department-box-info/department-box-info.component';
import {MatCardModule} from '@angular/material/card';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {DepartmentBoxInfoCreateComponent} from './department-box-info-create/department-box-info-create.component';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {BoxInfoManagerByDepartmentComponent} from './department-box-info-manager/box-info-manager-by-department.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {OptionalBoxInfoCreatorComponent} from './optional-box-info-creator/optional-box-info-creator.component';
import {BoxInfoListByVisitComponent} from '@fe/app/hospital/department-box/department-box-info-list/box-info-list-by-visit.component';
import {BoxInfoListByDepartmentComponent} from '@fe/app/hospital/department-box/department-box-info-list/box-info-list-by-department.component';
import {BoxInfoManagerByVisitComponent} from '@fe/app/hospital/department-box/department-box-info-manager/box-info-manager-by-visit.component';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,

        MatCardModule,
        MatPaginatorModule,
        MatInputModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatIconModule,
        MatButtonModule,
        TranslateModule,
    ],
    exports: [
        BoxInfoListByVisitComponent,
        BoxInfoListByDepartmentComponent,
        BoxInfoManagerByDepartmentComponent,
        BoxInfoManagerByVisitComponent,
        DepartmentBoxInfoComponent,
        OptionalBoxInfoCreatorComponent
    ],
    declarations: [
        DepartmentBoxInfoComponent,
        BoxInfoListByVisitComponent,
        BoxInfoListByDepartmentComponent,
        DepartmentBoxInfoCreateComponent,
        BoxInfoManagerByDepartmentComponent,
        BoxInfoManagerByVisitComponent,
        OptionalBoxInfoCreatorComponent
    ]
})
export class DepartmentBoxModule {

}
