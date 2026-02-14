import {Component, inject} from '@angular/core';
import {RouteDataHandler} from '@fe/app/util/route-data-handler/route-data-handler';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {Permission} from '@shared/user/permission.enum';
import {selectCurrentUser} from '@fe/app/state/selector/current-user.selector';
import {Store} from '@ngrx/store';
import {PeopleService} from '@fe/app/people/people.service';
import {User} from '@shared/user/user';
import {Person} from '@shared/person/person';
import {selectUserSettings} from '@fe/app/state/selector/user-settings.selector';
import {UserSettings} from '@shared/user/user-settings';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-my-profile',
    templateUrl: './my-profile.component.html',
    providers: [RouteDataHandler]
})
export class MyProfileComponent {

    private readonly store = inject(Store);
    private readonly route = inject(RouteDataHandler);
    private readonly permission = inject(PermissionService);
    private readonly peopleService = inject(PeopleService);

    protected editMode: boolean;
    protected user?: User;
    protected userSettings?: UserSettings;
    protected person?: Person;

    constructor() {
        this.setupEditMode();
        this.setupUserInfo();
    }

    protected canWriteSelf(): boolean {
        return this.permission.has(Permission.canWriteSelf);
    }

    protected switchToEdit(): void {
        this.editMode = true;
        this.route.setParam('edit', true);
    }

    protected cancelEdit(): void {
        this.editMode = false;
        this.route.removeParam('edit');
    }

    private setupEditMode(): void {
        this.route.subscribeToParam('edit').pipe(takeUntilDestroyed()).subscribe((edit?: string) => {
            this.editMode = Boolean(edit);
            if (!this.canWriteSelf()) {
                this.editMode = false;
                this.route.removeParam('edit');
            }
        });
    }

    private setupUserInfo(): void {
        this.store.pipe(selectCurrentUser, takeUntilDestroyed()).subscribe(cu => {
            this.user = cu;
            this.peopleService.getPerson(this.user.personId).subscribe(person => {
                this.person = person;
            });
        });
        this.store.pipe(selectUserSettings, takeUntilDestroyed()).subscribe(us => {
            this.userSettings = us;
        });
    }

}
