import {ChangeDetectionStrategy, Component, computed, effect, inject, input, signal} from '@angular/core';
import {form, FormField, submit} from '@angular/forms/signals';
import {HomePageOption, isNil, Nullable, UserSettings, UUID} from '@melluin/common';
import {ReactiveFormsModule} from '@angular/forms';
import {HomePageOptionSelectorComponent} from '@fe/app/my-profile/user-settings-editor/user-home-page-settings-editor/home-page-option-selector/home-page-option-selector.component';
import {MatButton} from '@angular/material/button';
import {TranslatePipe} from '@ngx-translate/core';
import {MessageService} from '@fe/app/util/message.service';
import {CredentialStoreService} from '@fe/app/auth/service/credential-store.service';
import {UserService} from '@fe/app/people/user.service';
import {firstValueFrom} from 'rxjs';
import {AppSubmit} from '@fe/app/util/submit/app-submit';

@Component({
    imports: [
        ReactiveFormsModule,
        HomePageOptionSelectorComponent,
        MatButton,
        TranslatePipe,
        AppSubmit,
        FormField
    ],
    selector: 'app-user-home-page-settings-editor',
    templateUrl: './user-home-page-settings-editor.component.html',
    styleUrls: ['./user-home-page-settings-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserHomePageSettingsEditorComponent {

    private readonly msg = inject(MessageService);
    private readonly credentialStoreService = inject(CredentialStoreService);
    private readonly userService = inject(UserService);

    public readonly userId = input.required<UUID>();
    public readonly settings = input.required<UserSettings>();

    private readonly formModel = signal(this.getDefaultFormModel());
    protected readonly form = form(this.formModel);

    protected readonly isSaveBtnDisabled = computed(() => this.form().invalid() || this.form().submitting());

    constructor() {
        effect(() => this.setupFormValues());
    }

    protected submitSettings(): void {
        submit(this.form, async () => {
            const userSettings = await firstValueFrom(
                this.userService.updateUserSettings(this.userId(), this.generateDto())
            );
            this.credentialStoreService.setupUserSettings(userSettings);
            this.msg.success('SaveSuccessful');
        });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    private getDefaultFormModel() {
        return {
            inDesktop: null as Nullable<HomePageOption>,
            inMobile: null as Nullable<HomePageOption>
        };
    }

    private setupFormValues(): void {
        const settings = this.settings().homePage;
        if (isNil(settings)) {
            this.formModel.set(this.getDefaultFormModel());
            return;
        }
        this.formModel.set({
            inDesktop: settings.inDesktop ?? null,
            inMobile: settings.inMobile ?? null,
        });
    }

    private generateDto(): UserSettings {
        return {
            ...this.settings(),
            homePage: {
                inDesktop: this.formModel().inDesktop ?? undefined,
                inMobile: this.formModel().inMobile ?? undefined
            }
        }
    }

}
