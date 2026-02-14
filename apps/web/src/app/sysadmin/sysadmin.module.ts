import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {RoleSettingsComponent} from './role-settings/role-settings.component';
import {MatTableModule} from '@angular/material/table';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {TrimmedTextInputModule} from '@fe/app/util/trimmed-text-input/trimmed-text-input.module';
import {RoleCreateComponent} from '@fe/app/sysadmin/role-settings/role-create/role-create.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,

        TranslateModule,

        MatTableModule,
        MatOptionModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        TrimmedTextInputModule,
    ],
    declarations: [
        RoleCreateComponent,
        RoleSettingsComponent
    ]
})
export class SysadminModule {
}
