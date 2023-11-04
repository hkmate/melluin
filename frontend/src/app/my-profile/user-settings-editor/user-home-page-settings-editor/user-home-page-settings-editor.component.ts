import {Component} from '@angular/core';
import {UserSettings} from '@shared/user/user-settings';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Store} from '@ngrx/store';
import {MessageService} from '@fe/app/util/message.service';
import {UserService} from '@fe/app/people/user.service';
import {CustomUserSettingsEditorBaseComponent} from '@fe/app/my-profile/user-settings-editor/user-settings-editor.component';

@Component({
    selector: 'app-user-home-page-settings-editor',
    templateUrl: './user-home-page-settings-editor.component.html',
    styleUrls: ['./user-home-page-settings-editor.component.scss']
})
export class UserHomePageSettingsEditorComponent extends CustomUserSettingsEditorBaseComponent {

    protected form: FormGroup;

    constructor(private readonly fb: FormBuilder,
                store: Store,
                msg: MessageService,
                userService: UserService) {
        super(store, msg, userService);
    }

    public ngOnInit(): void {
        this.initForm();
    }

    protected override isSaveBtnDisabled(): boolean {
        return this.form.invalid || super.isSaveBtnDisabled();
    }

    protected override generateNewSettings(): UserSettings {
        return {
            ...this.settings,
            homePage: {
                inDesktop: this.form.controls.inDesktop.value,
                inMobile: this.form.controls.inMobile.value
            }
        }
    }

    private initForm(): void {
        this.form = this.fb.group({
            inDesktop: [this.settings.homePage?.inDesktop],
            inMobile: [this.settings.homePage?.inMobile],
        });
    }

}
