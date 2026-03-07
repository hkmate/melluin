import {Component, inject, signal} from '@angular/core';
import {RouteDataHandler} from '@fe/app/util/route-data-handler/route-data-handler';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {isNil, Permission, Person} from '@melluin/common';
import {PeopleService} from '@fe/app/people/people.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MyProfileEditorComponent} from '@fe/app/my-profile/my-profile-editor/my-profile-editor.component';
import {MyProfilePresentComponent} from '@fe/app/my-profile/my-profile-present/my-profile-present.component';
import {MatButton} from '@angular/material/button';
import {TranslatePipe} from '@ngx-translate/core';
import {CurrentUserService} from '@fe/app/auth/service/current-user.service';

@Component({
    imports: [
        MyProfileEditorComponent,
        MyProfilePresentComponent,
        MatButton,
        TranslatePipe
    ],
    selector: 'app-my-profile',
    templateUrl: './my-profile.component.html',
    providers: [RouteDataHandler]
})
export class MyProfileComponent {

    private readonly route = inject(RouteDataHandler);
    private readonly permission = inject(PermissionService);
    private readonly currentUserService = inject(CurrentUserService);
    private readonly peopleService = inject(PeopleService);

    protected readonly editMode = signal(false);
    protected readonly user = this.currentUserService.currentUser;
    protected readonly userSettings = this.currentUserService.userSettings;
    protected readonly person = signal<Person | undefined>(undefined);

    constructor() {
        this.setupEditMode();
        this.setupPerson();
    }

    protected canWriteSelf(): boolean {
        return this.permission.has(Permission.canWriteSelf);
    }

    protected switchToEdit(): void {
        this.editMode.set(true);
        this.route.setParam('edit', true);
    }

    protected cancelEdit(): void {
        this.editMode.set(false);
        this.route.removeParam('edit');
    }

    private setupEditMode(): void {
        this.route.subscribeToParam('edit').pipe(takeUntilDestroyed()).subscribe((edit?: string) => {
            this.editMode.set(Boolean(edit));
            if (!this.canWriteSelf()) {
                this.editMode.set(false);
                this.route.removeParam('edit');
            }
        });
    }

    private setupPerson(): void {
        const currentUser = this.user();
        if (isNil(currentUser)) {
            this.person.set(undefined);
            return;
        }
        this.peopleService.getPerson(currentUser.personId).subscribe(person => {
            this.person.set(person);
        });
    }

}
