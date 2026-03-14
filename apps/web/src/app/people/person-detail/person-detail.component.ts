import {Component, computed, inject, signal} from '@angular/core';
import {Location} from '@angular/common';
import {getPermissionsNeededToChangeRole, isNil, Permission, Person} from '@melluin/common';
import {CREATE_MARKER, CreateMarkerType, PATHS} from '@fe/app/app-paths';
import {Router} from '@angular/router';
import {RouteDataHandler} from '@fe/app/util/route-data-handler/route-data-handler';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {PersonDataFormComponent} from '@fe/app/people/person-detail/person-data-form/person-data-form.component';
import {PersonDataPresenterComponent} from '@fe/app/people/person-detail/person-data-persenter/person-data-presenter.component';
import {TranslatePipe} from '@ngx-translate/core';
import {MatButton} from '@angular/material/button';
import {UserDetailComponent} from '@fe/app/people/person-detail/user-detail/user-detail.component';
import {UserService} from '@fe/app/people/user.service';

@Component({
    imports: [
        PersonDataFormComponent,
        PersonDataPresenterComponent,
        TranslatePipe,
        MatButton,
        UserDetailComponent
    ],
    providers: [RouteDataHandler, UserService],
    selector: 'app-person-detail',
    templateUrl: './person-detail.component.html'
})
export class PersonDetailComponent {

    private readonly router = inject(Router);
    private readonly location = inject(Location);
    private readonly route = inject(RouteDataHandler);
    private readonly permission = inject(PermissionService);

    protected readonly isEdit = signal(false);
    protected readonly person = signal<Person | undefined>(undefined);
    protected readonly isCurrentUsersPerson = computed(() => this.permission.personId === this.person()?.id);
    protected readonly isEditEnabled = computed(() => this.computeEditEnableValue());

    constructor() {
        this.route.getData<Person | CreateMarkerType>('person').pipe(takeUntilDestroyed()).subscribe(
            personInfo => {
                this.setUp(personInfo);
            }
        );
    }

    protected setSavedPerson(data: Person): void {
        this.person.set(data);
        this.setIdInUrl(data.id)
        this.setToPresent();
    }

    protected cancelEditing(): void {
        if (isNil(this.person())) {
            this.router.navigate([PATHS.people.main]);
        }
        this.setToPresent();
    }

    protected switchToEdit(): void {
        this.isEdit.set(true);
        this.route.setParam('edit', true);
    }

    private setToPresent(): void {
        this.isEdit.set(false);
        this.route.removeParam('edit');
    }

    private setUp(personInfo: Person | CreateMarkerType): void {
        this.isEdit.set(this.route.getParam('edit') === 'true');
        if (personInfo === CREATE_MARKER) {
            this.isEdit.set(true);
            this.person.set(undefined)
        } else {
            this.person.set(personInfo);
        }
    }

    private setIdInUrl(personId: string): void {
        this.location.replaceState(`${PATHS.people.main}/${personId}`);
    }

    private computeEditEnableValue(): boolean {
        const person = this.person();
        if (isNil(person) || isNil(person.user)) {
            return true;
        }
        if (this.isCurrentUsersPerson()) {
            return this.permission.has(Permission.canWriteSelf);
        }
        return person.user?.roles.every(role => {
            const neededPermission = getPermissionsNeededToChangeRole(role.type);
            return this.permission.has(neededPermission);
        }) ?? false;
    }

}
