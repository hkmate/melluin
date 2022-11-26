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

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,

        TranslateModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,

        AuthModule,
    ],
    declarations: [LoginComponent],
    exports: [LoginComponent]
})
export class LoginModule {
}
