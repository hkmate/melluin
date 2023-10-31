import {Component, Input} from '@angular/core';
import {EventsDateFilter, UserSettings} from '@shared/user/user-settings';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {Department} from '@shared/department/department';
import {Person} from '@shared/person/person';
import {Store} from '@ngrx/store';
import {MessageService} from '@fe/app/util/message.service';
import {DepartmentService} from '@fe/app/hospital/department/department.service';
import {PeopleService} from '@fe/app/people/people.service';
import {UserService} from '@fe/app/people/user.service';
import {AppActions} from '@fe/app/state/app-actions';
import {Pageable} from '@shared/api-util/pageable';
import {FilterOperationBuilder} from '@shared/api-util/filter-options';
import {isNilOrEmpty} from '@shared/util/util';

@Component({
    selector: 'app-user-event-list-settings-editor',
    templateUrl: './user-event-list-settings-editor.component.html',
    styleUrls: ['./user-event-list-settings-editor.component.scss']
})
export class UserEventListSettingsEditorComponent {

    @Input()
    public userId: string;

    @Input()
    public settings: UserSettings;

    protected form: FormGroup;
    protected statusOptions: Array<HospitalVisitStatus> = Object.values(HospitalVisitStatus);
    protected departmentOptions: Array<Department>;
    protected personOptions: Array<Person>;
    protected dateOptions: Array<EventsDateFilter> = Object.values(EventsDateFilter);
    private savingInProcess: boolean;

    constructor(private readonly fb: FormBuilder,
                private readonly store: Store,
                private readonly msg: MessageService,
                private readonly departmentService: DepartmentService,
                private readonly peopleService: PeopleService,
                private readonly userService: UserService) {
    }

    public ngOnInit(): void {
        this.initForm();
        this.initPersonOptions();
        this.initDepartmentOptions();
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
        this.form = this.fb.group({
            dateFilter: [this.settings.eventList?.dateFilter],
            participants: [],
            statuses: [this.settings.eventList?.statuses],
            departmentIds: [this.settings.eventList?.departmentIds],
            needHighlight: [this.settings.eventList?.needHighlight],
        });
    }

    private parseForm(): UserSettings {
        return {
            ...this.settings,
            eventList: {
                dateFilter: this.form.controls.dateFilter.value,
                statuses: this.form.controls.statuses.value,
                departmentIds: this.form.controls.departmentIds.value,
                participantIds: this.form.controls.participants.value.map(p => p.id),
                needHighlight: this.form.controls.needHighlight.value,
            }
        }
    }

    private initDepartmentOptions(): void {
        this.departmentService.findDepartments({page: 1, size: 100}).subscribe(
            (departmentPage: Pageable<Department>) => {
                this.departmentOptions = departmentPage.items;
            }
        );
    }

    private initPersonOptions(): void {
        this.peopleService.findPeople({
            page: 1,
            size: 100,
            sort: {'lastName': 'ASC', 'firstName': 'ASC'},
            where: {'user.isActive': FilterOperationBuilder.eq(true)}
        }).subscribe(
            (personPageable: Pageable<Person>) => {
                this.personOptions = personPageable.items;
                this.initSelectedPeople();
            }
        );
    }

    private initSelectedPeople(): void {
        const participantIds = this.settings.eventList?.participantIds;
        if (isNilOrEmpty(participantIds)) {
            this.form.controls.participants.setValue([]);
            return;
        }
        this.form.controls.participants.setValue(
            this.personOptions.filter(person => participantIds?.includes(person.id))
        );
    }

}
