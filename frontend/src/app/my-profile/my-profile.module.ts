import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {MyProfileComponent} from '@fe/app/my-profile/my-profile.component';
import {MyProfilePresentComponent} from './my-profile-present/my-profile-present.component';
import {MatButtonModule} from '@angular/material/button';
import {TranslateModule} from '@ngx-translate/core';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {OptionalPipe} from '@fe/app/util/optional.pipe';
import {UserSettingsPresenterComponent} from './user-custom-info-presenter/user-settings-presenter.component';
import {MyProfileEditorComponent} from './my-profile-editor/my-profile-editor.component';
import {UserSettingsEditorComponent} from './user-custom-info-editor/user-settings-editor.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,

        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,

        TranslateModule,

        OptionalPipe
    ],
    declarations: [
        MyProfileComponent,
        MyProfilePresentComponent,
        UserSettingsPresenterComponent,
        MyProfileEditorComponent,
        UserSettingsEditorComponent
    ]
})
export class MyProfileModule {
}
