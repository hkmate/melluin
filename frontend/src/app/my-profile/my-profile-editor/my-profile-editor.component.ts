import {Component, EventEmitter, Input, Output} from '@angular/core';
import {User} from '@shared/user/user';
import {Person} from '@shared/person/person';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MessageService} from '@fe/app/util/message.service';
import {anyNil, isNilOrEmpty} from '@shared/util/util';
import {passwordMinLength, passwordPattern} from '@shared/constants';
import {PeopleService} from '@fe/app/people/people.service';
import {UserService} from '@fe/app/people/user.service';
import {PersonRewrite} from '@shared/person/person-rewrite';
import {UserRewrite} from '@shared/user/user-rewrite';
import {UserSettings} from '@shared/user/user-settings';
import {AppActions} from '@fe/app/state/app-actions';
import {Store} from '@ngrx/store';

@Component({
    selector: 'app-my-profile-editor',
    templateUrl: './my-profile-editor.component.html',
    styleUrls: ['./my-profile-editor.component.scss']
})
export class MyProfileEditorComponent {

    protected readonly passwordMinLength = passwordMinLength;

    @Output()
    public editEnded = new EventEmitter<void>();

    protected personForm: FormGroup;
    protected userForm: FormGroup;
    private originalPerson: Person;
    protected originalUser: User;
    protected originalUserSettings: UserSettings;
    private personSaveInProcess: boolean;
    private userSaveInProcess: boolean;

    @Input()
    public set user(user: User) {
        this.originalUser = user;
        this.init();
    }

    @Input()
    public set person(person: Person) {
        this.originalPerson = person;
        this.init();
    }

    @Input()
    public set userSettings(settings: UserSettings) {
        this.originalUserSettings = settings;
        this.init();
    }

    constructor(private readonly fb: FormBuilder,
                private readonly store: Store,
                private readonly msg: MessageService,
                private readonly peopleService: PeopleService,
                private readonly userService: UserService) {
    }

    protected cancelEditing(): void {
        this.editEnded.emit();
    }

    protected submitPersonForm(): void {
        this.personSaveInProcess = true;
        this.peopleService.updatePerson(this.originalPerson.id, this.parsePersonForm()).subscribe({
            next: () => {
                this.personSaveInProcess = false;
                this.msg.success('SaveSuccessful');
            },
            error: () => {
                this.personSaveInProcess = false;
            }
        });
    }

    protected submitUserForm(): void {
        this.userSaveInProcess = true;
        this.userService.updateUser(this.originalUser.id, this.parseUserForm()).subscribe({
            next: (user: User) => {
                this.userSaveInProcess = false;
                this.msg.success('SaveSuccessful');
                this.store.dispatch(AppActions.currentUserLoaded({user}))
            },
            error: () => {
                this.userSaveInProcess = false;
            }
        });
    }

    protected isPersonFormBtnDisabled(): boolean {
        return this.personForm.invalid || this.personSaveInProcess;
    }

    protected isUserFormBtnDisabled(): boolean {
        return this.userForm.invalid || this.userSaveInProcess;
    }

    protected isBackBtnDisabled(): boolean {
        return this.personSaveInProcess || this.userSaveInProcess;
    }

    private init(): void {
        if (anyNil(this.originalPerson, this.originalUser, this.originalUserSettings)) {
            return;
        }
        this.setupForm();
    }

    private setupForm(): void {
        this.personForm = this.fb.group({
            firstName: [this.originalPerson.firstName, [Validators.required]],
            lastName: [this.originalPerson.lastName, [Validators.required]],
            email: [this.originalPerson.email],
            phone: [this.originalPerson.phone],
            canVolunteerSeeMyEmail: [this.originalPerson.preferences?.canVolunteerSeeMyEmail ?? false],
            canVolunteerSeeMyPhone: [this.originalPerson.preferences?.canVolunteerSeeMyPhone ?? false]
        });
        this.userForm = this.fb.group({
            userName: [this.originalUser.userName],
            password: [undefined, [Validators.pattern(passwordPattern)]]
        });
    }

    private parsePersonForm(): PersonRewrite {
        return {
            firstName: this.personForm.controls.firstName.value,
            lastName: this.personForm.controls.lastName.value,
            email: this.personForm.controls.email.value,
            phone: this.personForm.controls.phone.value,
            preferences: {
                canVolunteerSeeMyEmail: this.personForm.controls.canVolunteerSeeMyEmail.value,
                canVolunteerSeeMyPhone: this.personForm.controls.canVolunteerSeeMyPhone.value
            }
        }
    }

    private parseUserForm(): UserRewrite {
        const newPassword = this.userForm.controls.password.value;
        return {
            userName: this.userForm.controls.userName.value,
            password: isNilOrEmpty(newPassword) ? undefined : newPassword,
            isActive: this.originalUser.isActive,
            roles: this.originalUser.roles,
            customPermissions: this.originalUser.customPermissions
        };
    }

}
