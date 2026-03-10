import {ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal} from '@angular/core';
import {
    isNil,
    isNilOrEmpty,
    passwordMinLength,
    passwordPattern,
    Person,
    PersonRewrite,
    User,
    UserRewrite,
    UserSettings
} from '@melluin/common';
import {MessageService} from '@fe/app/util/message.service';
import {PeopleService} from '@fe/app/people/people.service';
import {UserService} from '@fe/app/people/user.service';
import {TranslatePipe} from '@ngx-translate/core';
import {TrimmedTextInputComponent2} from '@fe/app/util/trimmed-text-input/trimmed-text-input.component';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatButton} from '@angular/material/button';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {UserSettingsEditorComponent} from '@fe/app/my-profile/user-settings-editor/user-settings-editor.component';
import {CredentialStoreService} from '@fe/app/auth/service/credential-store.service';
import {AppSubmit} from '@fe/app/util/submit/app-submit';
import {form, FormField, pattern, required, submit} from '@angular/forms/signals';
import {firstValueFrom} from 'rxjs';
import {MelluinMatErrorComponent} from '@fe/app/util/melluin-mat-error/melluin-mat-error.component';
import {t} from '@fe/app/util/translate/translate';
import {PasswordInputComponent} from '@fe/app/util/password-input/password-input.component';

@Component({
    imports: [
        TranslatePipe,
        TrimmedTextInputComponent2,
        MatCardContent,
        MatCard,
        MatCheckbox,
        MatButton,
        MatLabel,
        MatFormField,
        MatInput,
        UserSettingsEditorComponent,
        AppSubmit,
        FormField,
        MatError,
        MelluinMatErrorComponent,
        PasswordInputComponent
    ],
    selector: 'app-my-profile-editor',
    templateUrl: './my-profile-editor.component.html',
    styleUrls: ['./my-profile-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyProfileEditorComponent {

    private readonly msg = inject(MessageService);
    private readonly peopleService = inject(PeopleService);
    private readonly userService = inject(UserService);
    private readonly credentialStoreService = inject(CredentialStoreService);

    public readonly person = input.required<Person>();
    public readonly user = input.required<User>();
    public readonly userSettings = input.required<UserSettings>();

    public readonly editEnded = output<void>();

    protected readonly personModel = signal(this.getDefaultPersonFormModel());
    protected readonly personForm = form(this.personModel, schema => {
        required(schema.firstName, {message: t('Form.Required')});
        required(schema.lastName, {message: t('Form.Required')});
    });

    protected readonly userModel = signal(this.getDefaultUserFormModel());
    protected readonly userForm = form(this.userModel, schema => {
        required(schema.userName, {message: t('Form.Required')});
        pattern(schema.password, new RegExp(passwordPattern),
            {message: t('PersonPage.User.Form.PasswordPatternHint', {passwordMinLength})}
        );
    });

    protected readonly isPersonFormBtnDisabled = computed(() => this.personForm().invalid() || this.personForm().submitting());
    protected readonly isUserFormBtnDisabled = computed(() => this.userForm().invalid() || this.userForm().submitting());
    protected readonly isBackBtnDisabled = computed(() => this.isPersonFormBtnDisabled() || this.isUserFormBtnDisabled());

    constructor() {
        effect(() => this.setupPersonFormValues());
        effect(() => this.setupUserFormValues());
    }

    protected cancelEditing(): void {
        this.editEnded.emit();
    }

    protected submitPersonForm(): void {
        submit(this.personForm, async () => {
            await firstValueFrom(this.peopleService.updatePerson(this.person().id, this.generatePersonRewriteDto()));
            this.msg.success('SaveSuccessful');
        })
    }

    protected submitUserForm(): void {
        submit(this.userForm, async () => {
            const user = await firstValueFrom(
                this.userService.updateUser(this.user().id, this.generateUserRewriteDto()));
            this.msg.success('SaveSuccessful');
            this.credentialStoreService.setupUser(user);
        });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    private getDefaultPersonFormModel() {
        return {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            canVolunteerSeeMyEmail: false,
            canVolunteerSeeMyPhone: false
        };
    }

    private setupPersonFormValues(): void {
        const person = this.person();
        if (isNil(person)) {
            this.personModel.set(this.getDefaultPersonFormModel());
            return;
        }
        this.personModel.set({
            firstName: person.firstName,
            lastName: person.lastName,
            email: person.email ?? '',
            phone: person.phone ?? '',
            canVolunteerSeeMyEmail: person.preferences?.canVolunteerSeeMyEmail ?? false,
            canVolunteerSeeMyPhone: person.preferences?.canVolunteerSeeMyPhone ?? false
        });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    private getDefaultUserFormModel() {
        return {
            userName: '',
            password: ''
        };
    }

    private setupUserFormValues(): void {
        const user = this.user();
        if (isNil(user)) {
            this.userModel.set(this.getDefaultUserFormModel());
            return;
        }
        this.userModel.set({
            userName: user.userName,
            password: '',
        });
    }

    private generatePersonRewriteDto(): PersonRewrite {
        const model = this.personModel();
        return {
            firstName: model.firstName,
            lastName: model.lastName,
            email: model.email,
            phone: model.phone,
            cities: this.person().cities!,
            preferences: {
                canVolunteerSeeMyEmail: model.canVolunteerSeeMyEmail,
                canVolunteerSeeMyPhone: model.canVolunteerSeeMyPhone
            }
        }
    }

    private generateUserRewriteDto(): UserRewrite {
        const model = this.userModel();
        return {
            userName: model.userName,
            password: isNilOrEmpty(model.password) ? undefined : model.password,
            isActive: this.user().isActive,
            roleNames: this.user().roles.map(role => role.name),
            customPermissions: this.user().customPermissions
        }
    }

}
