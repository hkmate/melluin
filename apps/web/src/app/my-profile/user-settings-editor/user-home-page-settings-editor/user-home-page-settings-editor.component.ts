import {Component, computed, inject} from '@angular/core';
import {UserSettings} from '@melluin/common';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {HomePageOptionSelectorComponent} from '@fe/app/my-profile/user-settings-editor/user-home-page-settings-editor/home-page-option-selector/home-page-option-selector.component';
import {MatButton} from '@angular/material/button';
import {TranslatePipe} from '@ngx-translate/core';
import {CustomUserSettingsEditorBaseComponent} from '@fe/app/my-profile/user-settings-editor/custom-user-settings-editor.base.component';

@Component({
    selector: 'app-user-home-page-settings-editor',
    templateUrl: './user-home-page-settings-editor.component.html',
    imports: [
        ReactiveFormsModule,
        HomePageOptionSelectorComponent,
        MatButton,
        TranslatePipe
    ],
    styleUrls: ['./user-home-page-settings-editor.component.scss']
})
export class UserHomePageSettingsEditorComponent extends CustomUserSettingsEditorBaseComponent {

    private readonly fb = inject(FormBuilder);

    protected form = computed(() => this.initForm());

    protected override isSaveBtnDisabled(): boolean {
        return this.form().invalid || super.isSaveBtnDisabled();
    }

    protected override generateNewSettings(): UserSettings {
        return {
            ...this.settings(),
            homePage: {
                inDesktop: this.form().controls.inDesktop.value,
                inMobile: this.form().controls.inMobile.value
            }
        }
    }

    private initForm(): FormGroup {
        return this.fb.group({
            inDesktop: [this.settings().homePage?.inDesktop],
            inMobile: [this.settings().homePage?.inMobile],
        });
    }

}
