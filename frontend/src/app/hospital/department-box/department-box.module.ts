import {NgModule} from '@angular/core';
import {DepartmentBoxInfoComponent} from './department-box-info/department-box-info.component';
import {MatCardModule} from '@angular/material/card';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import { DepartmentBoxInfoListComponent } from './department-box-info-list/department-box-info-list.component';
import {MatPaginatorModule} from '@angular/material/paginator';


@NgModule({
    imports: [
        CommonModule,

        MatCardModule,
        MatPaginatorModule,
        TranslateModule,
    ],
    exports: [
        DepartmentBoxInfoListComponent
    ],
    declarations: [
        DepartmentBoxInfoComponent,
        DepartmentBoxInfoListComponent
    ]
})
export class DepartmentBoxModule {

}
