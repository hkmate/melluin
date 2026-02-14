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
import {UserSettingsPresenterComponent} from '@fe/app/my-profile/user-settings-presenter/user-settings-presenter.component';
import {MyProfileEditorComponent} from './my-profile-editor/my-profile-editor.component';
import {UserSettingsEditorComponent} from '@fe/app/my-profile/user-settings-editor/user-settings-editor.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatChipsModule} from '@angular/material/chips';
import {PersonNamePipe} from '@fe/app/people/person-name.pipe';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {PersonSelectModule} from '@fe/app/util/person-select/person-select.module';
import {UserHomePageSettingsEditorComponent} from '@fe/app/my-profile/user-settings-editor/user-home-page-settings-editor/user-home-page-settings-editor.component';
import {UserEventListSettingsEditorComponent} from '@fe/app/my-profile/user-settings-editor/user-event-list-settings-editor/user-event-list-settings-editor.component';
import {MatRadioModule} from '@angular/material/radio';
import { HomePageOptionSelectorComponent } from './user-settings-editor/user-home-page-settings-editor/home-page-option-selector/home-page-option-selector.component';
import {MatTabsModule} from '@angular/material/tabs';
import {UserDepartmentBoxWidgetSettingsComponent} from '@fe/app/my-profile/user-settings-editor/user-department-box-widget-settings/user-department-box-widget-settings.component';
import {TrimmedTextInputModule} from '@fe/app/util/trimmed-text-input/trimmed-text-input.module';

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
        MatChipsModule,
        MatOptionModule,
        MatSelectModule,
        MatRadioModule,
        MatTabsModule,
        MatInputModule,

        TranslateModule,

        OptionalPipe,
        PersonNamePipe,
        PersonSelectModule,
        TrimmedTextInputModule,
    ],
    declarations: [
        MyProfileComponent,
        MyProfilePresentComponent,
        UserSettingsPresenterComponent,
        MyProfileEditorComponent,
        UserSettingsEditorComponent,
        UserEventListSettingsEditorComponent,
        UserHomePageSettingsEditorComponent,
        UserDepartmentBoxWidgetSettingsComponent,
        HomePageOptionSelectorComponent
    ]
})
export class MyProfileModule {
}
