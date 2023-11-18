import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {LoginComponent} from './login.component';
import {CommonModule} from '@angular/common';
import {AuthModule} from '../auth/auth.module';
import {TranslateModule} from '@ngx-translate/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {TrimmedTextInputModule} from '@fe/app/util/trimmed-text-input/trimmed-text-input.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,

        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,

        TranslateModule,

        AuthModule,
        TrimmedTextInputModule,
    ],
    declarations: [LoginComponent],
    exports: [LoginComponent]
})
export class LoginModule {
}
