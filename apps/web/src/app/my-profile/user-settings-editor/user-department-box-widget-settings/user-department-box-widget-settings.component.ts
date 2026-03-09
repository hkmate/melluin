import {Component, computed, effect, inject, input, signal} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {
    BoxStatusChangeReason,
    DateIntervalSpecifier,
    DepartmentBoxInfoSinceDateValues,
    DepartmentBoxWidgetSettings,
    isNil,
    isNotEmpty,
    Nullable,
    UserSettings, UUID,
    WidgetType
} from '@melluin/common';
import {MatCard, MatCardSubtitle} from '@angular/material/card';
import {MatCheckbox} from '@angular/material/checkbox';
import {TranslatePipe} from '@ngx-translate/core';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButton} from '@angular/material/button';
import {defaultsDeep, set} from 'lodash-es';
import {MessageService} from '@fe/app/util/message.service';
import {CredentialStoreService} from '@fe/app/auth/service/credential-store.service';
import {UserService} from '@fe/app/people/user.service';
import {form, FormField, min, required, submit} from '@angular/forms/signals';
import {firstValueFrom} from 'rxjs';
import {AppSubmit} from '@fe/app/util/submit/app-submit';
import {MelluinMatErrorComponent} from '@fe/app/util/melluin-mat-error/melluin-mat-error.component';
import {t} from '@fe/app/util/translate/translate';

@Component({
    imports: [
        ReactiveFormsModule,
        MatCard,
        MatCardSubtitle,
        MatCheckbox,
        TranslatePipe,
        MatFormField,
        MatLabel,
        MatSelect,
        MatOption,
        MatInput,
        MatButton,
        AppSubmit,
        FormField,
        MatError,
        MelluinMatErrorComponent
    ],
    selector: 'app-user-department-box-widget-settings',
    templateUrl: './user-department-box-widget-settings.component.html',
    styleUrl: './user-department-box-widget-settings.component.scss'
})
export class UserDepartmentBoxWidgetSettingsComponent {

    protected readonly reasonOptions: Array<BoxStatusChangeReason> = Object.values(BoxStatusChangeReason);
    protected readonly dateOptions: Array<DateIntervalSpecifier> = DepartmentBoxInfoSinceDateValues;
    private static DEFAULT_LIMIT = 10;

    private readonly msg = inject(MessageService);
    private readonly credentialStoreService = inject(CredentialStoreService);
    private readonly userService = inject(UserService);

    public readonly userId = input.required<UUID>();
    public readonly settings = input.required<UserSettings>();

    private readonly formModel = signal(this.getDefaultFormModel());
    protected readonly form = form(this.formModel, schema => {
        required(schema.dateInterval, {message: t('Form.Required')})
        min(schema.limit, 1, {message: t('Form.Min', {min: 1})})
        min(schema.index, 0, {message: t('Form.Min', {min: 0})})
    });

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
            needed: false,
            index: 0,
            limit: UserDepartmentBoxWidgetSettingsComponent.DEFAULT_LIMIT,
            dateInterval: null as Nullable<DateIntervalSpecifier>,
            reasons: [] as Array<BoxStatusChangeReason>
        };
    }

    private setupFormValues(): void {
        const settings = this.settings().dashboard?.widgets?.departmentBox;
        if (isNil(settings)) {
            this.formModel.set(this.getDefaultFormModel());
            return;
        }
        this.formModel.set({
            needed: settings.needed ?? false,
            index: settings.index ?? 0,
            limit: settings.limit ?? UserDepartmentBoxWidgetSettingsComponent.DEFAULT_LIMIT,
            dateInterval: settings.dateInterval ?? null,
            reasons: settings.reasons ?? []
        });
    }

    private generateDto(): UserSettings {
        const newSettings = defaultsDeep({}, this.settings());
        set(newSettings, 'dashboard.widgets.departmentBox', {
            ...this.formModel(),
            dateInterval: this.formModel().dateInterval!,
            reasons: isNotEmpty(this.formModel().reasons) ? this.formModel().reasons : undefined,
            type: WidgetType.DEPARTMENT_BOX
        } satisfies DepartmentBoxWidgetSettings);
        return newSettings;
    }

}
