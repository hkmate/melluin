import {Component, computed, inject, input, output} from '@angular/core';
import {User} from '@shared/user/user';
import {Person} from '@shared/person/person';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MessageService} from '@fe/app/util/message.service';
import {isNilOrEmpty} from '@shared/util/util';
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

    private readonly fb = inject(FormBuilder);
    private readonly store = inject(Store);
    private readonly msg = inject(MessageService);
    private readonly peopleService = inject(PeopleService);
    private readonly userService = inject(UserService);

    protected readonly passwordMinLength = passwordMinLength;

    public readonly user = input.required<User>();
    public readonly person = input.required<Person>();
    public readonly userSettings = input.required<UserSettings>();

    public editEnded = output<void>();

    protected personForm = computed(() => this.setupPersonForm());
    protected userForm = computed(() => this.setupUserForm());
    private personSaveInProcess: boolean;
    private userSaveInProcess: boolean;

    protected cancelEditing(): void {
        this.editEnded.emit();
    }

    protected submitPersonForm(): void {
        this.personSaveInProcess = true;
        this.peopleService.updatePerson(this.person().id, this.parsePersonForm()).subscribe({
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
        this.userService.updateUser(this.user().id, this.parseUserForm()).subscribe({
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
        return this.personForm().invalid || this.personSaveInProcess;
    }

    protected isUserFormBtnDisabled(): boolean {
        return this.userForm().invalid || this.userSaveInProcess;
    }

    protected isBackBtnDisabled(): boolean {
        return this.personSaveInProcess || this.userSaveInProcess;
    }

    private setupUserForm(): FormGroup {
        return this.fb.group({
            userName: [this.user().userName],
            password: [undefined, [Validators.pattern(passwordPattern)]]
        });
    }

    private setupPersonForm(): FormGroup {
        return this.fb.group({
            firstName: [this.person().firstName, [Validators.required]],
            lastName: [this.person().lastName, [Validators.required]],
            email: [this.person().email],
            phone: [this.person().phone],
            canVolunteerSeeMyEmail: [this.person().preferences?.canVolunteerSeeMyEmail ?? false],
            canVolunteerSeeMyPhone: [this.person().preferences?.canVolunteerSeeMyPhone ?? false]
        });
    }

    private parsePersonForm(): PersonRewrite {
        return {
            firstName: this.personForm().controls.firstName.value,
            lastName: this.personForm().controls.lastName.value,
            email: this.personForm().controls.email.value,
            phone: this.personForm().controls.phone.value,
            preferences: {
                canVolunteerSeeMyEmail: this.personForm().controls.canVolunteerSeeMyEmail.value,
                canVolunteerSeeMyPhone: this.personForm().controls.canVolunteerSeeMyPhone.value
            }
        }
    }

    private parseUserForm(): UserRewrite {
        const newPassword = this.userForm().controls.password.value;
        return {
            userName: this.userForm().controls.userName.value,
            password: isNilOrEmpty(newPassword) ? undefined : newPassword,
            isActive: this.user().isActive,
            roleNames: this.user().roles.map(role => role.name),
            customPermissions: this.user().customPermissions
        };
    }

}
