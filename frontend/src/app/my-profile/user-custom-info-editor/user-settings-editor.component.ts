import {Component, Input, OnInit} from '@angular/core';
import {UserSettings} from '@shared/user/user';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MessageService} from '@fe/app/util/message.service';
import {UserService} from '@fe/app/people/user.service';
import {Store} from '@ngrx/store';
import {AppActions} from '@fe/app/state/app-actions';

@Component({
    selector: 'app-user-custom-info-editor',
    templateUrl: './user-settings-editor.component.html',
    styleUrls: ['./user-settings-editor.component.scss']
})
export class UserSettingsEditorComponent implements OnInit {

    @Input()
    public userId: string;

    @Input()
    public settings: UserSettings;

    protected form: FormGroup;
    private savingInProcess: boolean;

    constructor(private readonly fb: FormBuilder,
                private readonly store: Store,
                private readonly msg: MessageService,
                private readonly userService: UserService) {
    }

    public ngOnInit(): void {
        this.initForm();
    }

    protected isSaveBtnDisabled(): boolean {
        return this.form.invalid || this.savingInProcess;
    }

    protected submitForm(): void {
        this.savingInProcess = true;
        this.userService.updateUserSettings(this.userId, this.parseForm()).subscribe({
            next: (userSettings: UserSettings) => {
                this.savingInProcess = false;
                this.msg.success('SaveSuccessful');
                this.store.dispatch(AppActions.userSettingsLoaded({userSettings}))
            },
            error: () => {
                this.savingInProcess = false;
            }
        });
    }

    private initForm(): void {
        this.form = this.fb.group({});
    }

    private parseForm(): UserSettings {
        return {
            ...this.settings,
        }
    }

}
