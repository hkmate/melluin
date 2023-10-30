import {Component, OnInit} from '@angular/core';
import {RouteDataHandler} from '@fe/app/util/route-data-handler/route-data-handler';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {Permission} from '@shared/user/permission.enum';
import {selectCurrentUser} from '@fe/app/state/selector/current-user.selector';
import {AutoUnSubscriberComponent} from '@fe/app/util/auto-unsubscriber.component';
import {Store} from '@ngrx/store';
import {PeopleService} from '@fe/app/people/people.service';
import {User, UserSettings} from '@shared/user/user';
import {Person} from '@shared/person/person';
import {selectUserSettings} from '@fe/app/state/selector/user-settings.selector';

@Component({
    selector: 'app-my-profile',
    templateUrl: './my-profile.component.html',
    styleUrls: ['./my-profile.component.scss'],
    providers: [RouteDataHandler]
})
export class MyProfileComponent extends AutoUnSubscriberComponent implements OnInit {

    protected editMode: boolean;
    protected user: User;
    protected userSettings: UserSettings;
    protected person: Person;

    constructor(private readonly store: Store,
                private readonly route: RouteDataHandler,
                private readonly permission: PermissionService,
                private readonly peopleService: PeopleService) {
        super();
    }

    public ngOnInit(): void {
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
        this.addSubscription(this.route.subscribeToParam('edit'), (edit: string) => {
            this.editMode = Boolean(edit);
            if (!this.canWriteSelf()) {
                this.editMode = false;
                this.route.removeParam('edit');
            }
        });
    }

    private setupUserInfo(): void {
        this.addSubscription(this.store.pipe(selectCurrentUser), cu => {
            this.user = cu;
            this.peopleService.getPerson(this.user.personId).subscribe(person => {
                this.person = person;
            });
        });
        this.addSubscription(this.store.pipe(selectUserSettings), us => {
            this.userSettings = us;
        });
    }

}
