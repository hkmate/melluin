import {Component, inject} from '@angular/core';
import {Location} from '@angular/common';
import {
    getPermissionsNeededToChangeRole,
    isNil,
    Permission,
    Person,
    PersonCreation,
    PersonRewrite
} from '@melluin/common';
import {PeopleService} from '@fe/app/people/people.service';
import {CREATE_MARKER, CreateMarkerType, PATHS} from '@fe/app/app-paths';
import {Router} from '@angular/router';
import {RouteDataHandler} from '@fe/app/util/route-data-handler/route-data-handler';
import {Observable, tap} from 'rxjs';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {MessageService} from '@fe/app/util/message.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {PersonDataFormComponent} from '@fe/app/people/person-detail/person-data-form/person-data-form.component';
import {PersonDataPresenterComponent} from '@fe/app/people/person-detail/person-data-persenter/person-data-presenter.component';
import {TranslatePipe} from '@ngx-translate/core';
import {MatButton} from '@angular/material/button';
import {UserDetailComponent} from '@fe/app/people/person-detail/user-detail/user-detail.component';

@Component({
    selector: 'app-person-detail',
    templateUrl: './person-detail.component.html',
    imports: [
        PersonDataFormComponent,
        PersonDataPresenterComponent,
        TranslatePipe,
        MatButton,
        UserDetailComponent
    ],
    providers: [RouteDataHandler]
})
export class PersonDetailComponent {

    private readonly router = inject(Router);
    private readonly location = inject(Location);
    private readonly msg = inject(MessageService);
    private readonly route = inject(RouteDataHandler);
    private readonly permission = inject(PermissionService);
    private readonly peopleService = inject(PeopleService);

    protected isCreation = false;
    protected isEdit = false;
    protected isEditEnabled = false;
    protected person?: Person;

    constructor() {
        this.route.getData<Person | CreateMarkerType>('person').pipe(takeUntilDestroyed()).subscribe(
            personInfo => {
                this.setUp(personInfo);
            }
        );
    }

    protected isEditMode(): boolean {
        return this.isEdit || this.isCreation;
    }

    protected savePerson(data: PersonRewrite | PersonCreation): void {
        this.createSaveRequest(data).subscribe(person => {
            this.person = person;
            this.msg.success('SaveSuccessful');
            this.setToPresent();
        });
    }

    protected cancelEditing(): void {
        if (this.isCreation) {
            this.router.navigate([PATHS.people.main]);
        }
        this.setToPresent();
    }

    protected switchToEdit(): void {
        this.isEdit = true;
        this.route.setParam('edit', true);
    }

    protected isActualPersonSelf(): boolean {
        return this.permission.personId === this.person?.id;
    }

    private setToPresent(): void {
        this.isEdit = false;
        this.isCreation = false;
        this.route.removeParam('edit');
    }

    private setUp(personInfo: Person | CreateMarkerType): void {
        this.isEdit = this.route.getParam('edit') === 'true';
        if (personInfo === CREATE_MARKER) {
            this.isCreation = true;
        } else {
            this.person = personInfo;
        }
        this.setEditEnableValue();
    }

    private createSaveRequest(data: PersonCreation | PersonRewrite): Observable<Person> {
        if (this.isCreation) {
            return this.peopleService.addPerson(data).pipe(tap(person => this.setIdInUrl(person.id)));
        }
        return this.peopleService.updatePerson(this.person!.id, data);
    }

    private setIdInUrl(personId: string): void {
        this.location.replaceState(`${PATHS.people.main}/${personId}`);
    }

    private setEditEnableValue(): void {
        if (isNil(this.person) || isNil(this.person.user)) {
            this.isEditEnabled = true;
            return;
        }
        if (this.isActualPersonSelf()) {
            this.isEditEnabled = this.permission.has(Permission.canWriteSelf);
            return;
        }
        this.isEditEnabled = this.person.user?.roles.every(role => {
            const neededPermission = getPermissionsNeededToChangeRole(role.type);
            return this.permission.has(neededPermission);
        }) ?? false;
    }

}
