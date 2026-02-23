import {Component, inject, input} from '@angular/core';
import {Store} from '@ngrx/store';
import {MessageService} from '@fe/app/util/message.service';
import {UserService} from '@fe/app/people/user.service';
import {UserSettings} from '@melluin/common';
import {AppActions} from '@fe/app/state/app-actions';


@Component({template: ''})
export abstract class CustomUserSettingsEditorBaseComponent {

    protected readonly store = inject(Store);
    protected readonly msg = inject(MessageService);
    protected readonly userService = inject(UserService);

    public userId = input.required<string>();
    public settings = input.required<UserSettings>();

    protected savingInProcess: boolean;

    protected isSaveBtnDisabled(): boolean {
        return this.savingInProcess;
    }

    protected submit(): void {
        this.savingInProcess = true;
        this.userService.updateUserSettings(this.userId(), this.generateNewSettings()).subscribe({
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

    protected abstract generateNewSettings(): UserSettings;

}
