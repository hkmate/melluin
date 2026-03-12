import {ChangeDetectionStrategy, Component, computed, effect, inject, input, signal} from '@angular/core';
import {
    DateIntervalSpecifier,
    Department,
    EventsDateFilterValues,
    isNil,
    Nullable,
    Pageable,
    UserSettings, UUID,
    VisitStatus, VisitStatuses
} from '@melluin/common';
import {DepartmentService} from '@fe/app/hospital/department/department.service';
import {MatFormField, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {TranslatePipe} from '@ngx-translate/core';
import {PersonSelectComponent2} from '@fe/app/util/person-select/person-select.component';
import {MatCard, MatCardSubtitle} from '@angular/material/card';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatButton} from '@angular/material/button';
import {MessageService} from '@fe/app/util/message.service';
import {CredentialStoreService} from '@fe/app/auth/service/credential-store.service';
import {UserService} from '@fe/app/people/user.service';
import {form, FormField, submit} from '@angular/forms/signals';
import {firstValueFrom} from 'rxjs';
import {AppSubmit} from '@fe/app/util/submit/app-submit';

@Component({
    imports: [
        MatLabel,
        MatFormField,
        MatSelect,
        TranslatePipe,
        MatOption,
        PersonSelectComponent2,
        MatCard,
        MatCardSubtitle,
        MatCheckbox,
        MatButton,
        AppSubmit,
        FormField
    ],
    selector: 'app-user-event-list-settings-editor',
    templateUrl: './user-event-list-settings-editor.component.html',
    styleUrls: ['./user-event-list-settings-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserEventListSettingsEditorComponent {

    protected readonly statusOptions: Array<VisitStatus> = Object.values(VisitStatuses);
    protected readonly dateOptions: Array<DateIntervalSpecifier> = EventsDateFilterValues;

    private readonly msg = inject(MessageService);
    private readonly credentialStoreService = inject(CredentialStoreService);
    private readonly departmentService = inject(DepartmentService);
    private readonly userService = inject(UserService);

    public readonly userId = input.required<UUID>();
    public readonly settings = input.required<UserSettings>();

    private readonly formModel = signal(this.getDefaultFormModel());
    protected readonly form = form(this.formModel);

    protected readonly isSaveBtnDisabled = computed(() => this.form().invalid() || this.form().submitting());

    protected readonly departmentOptions = signal<Array<Department>>([]);

    constructor() {
        this.initDepartmentOptions();
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
            dateFilter: null as Nullable<DateIntervalSpecifier>,
            statuses: [] as Array<VisitStatus>,
            departmentIds: [] as Array<UUID>,
            participantIds: [] as Array<UUID>,
            needHighlight: false
        };
    }

    private setupFormValues(): void {
        const settings = this.settings().eventList;
        if (isNil(settings)) {
            this.formModel.set(this.getDefaultFormModel());
            return;
        }
        this.formModel.set({
            dateFilter: settings.dateFilter ?? null,
            statuses: settings.statuses ?? [],
            departmentIds: settings.departmentIds ?? [],
            participantIds: settings.participantIds ?? [],
            needHighlight: settings.needHighlight ?? false,
        });
    }

    private generateDto(): UserSettings {
        return {
            ...this.settings(),
            eventList: {
                dateFilter: this.formModel().dateFilter ?? undefined,
                statuses: this.formModel().statuses,
                departmentIds: this.formModel().departmentIds,
                participantIds: this.formModel().participantIds,
                needHighlight: this.formModel().needHighlight,
            }
        }
    }

    private initDepartmentOptions(): void {
        this.departmentService.findDepartments({page: 1, size: 100}).subscribe(
            (departmentPage: Pageable<Department>) => {
                this.departmentOptions.set(departmentPage.items);
            }
        );
    }

}
