import {Component, Input} from '@angular/core';
import {UserSettings} from '@shared/user/user-settings';
import {AppActions} from '@fe/app/state/app-actions';
import {Store} from '@ngrx/store';
import {MessageService} from '@fe/app/util/message.service';
import {UserService} from '@fe/app/people/user.service';

@Component({
    selector: 'app-user-settings-editor',
    templateUrl: './user-settings-editor.component.html',
    styleUrls: ['./user-settings-editor.component.scss']
})
export class UserSettingsEditorComponent {

    @Input()
    public userId: string;

    @Input()
    public settings: UserSettings;

}


@Component({template: ''})
export abstract class CustomUserSettingsEditorBaseComponent {

    @Input()
    public userId: string;

    @Input()
    public settings: UserSettings;

    protected savingInProcess: boolean;

    protected constructor(protected readonly store: Store,
                          protected readonly msg: MessageService,
                          protected readonly userService: UserService) {
    }

    protected isSaveBtnDisabled(): boolean {
        return this.savingInProcess;
    }

    protected submit(): void {
        this.savingInProcess = true;
        this.userService.updateUserSettings(this.userId, this.generateNewSettings()).subscribe({
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
