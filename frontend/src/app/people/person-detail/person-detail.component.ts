import {Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Person} from '@shared/person/person';
import {PersonRewrite} from '@shared/person/person-rewrite';
import {PersonCreation} from '@shared/person/person-creation';
import {PeopleService} from '@fe/app/people/people.service';
import {CREATE_MARKER, CreateMarkerType, PATHS} from '@fe/app/app-paths';
import {Router} from '@angular/router';
import {RouteDataHandler} from '@fe/app/util/route-data-handler/route-data-handler';
import {Observable, Subscription, tap, throwError} from 'rxjs';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {isNil} from '@shared/util/util';
import {getPermissionsNeededToChangeRole} from '@shared/user/role.enum';
import {Permission} from '@shared/user/permission.enum';

@Component({
    selector: 'app-person-detail',
    templateUrl: './person-detail.component.html',
    styleUrls: ['./person-detail.component.scss'],
    providers: [RouteDataHandler]
})
export class PersonDetailComponent implements OnInit, OnDestroy {

    protected isCreation = false;
    protected isEdit = false;
    protected isEditEnabled = false;
    protected person?: Person;
    private resolverSubscription: Subscription;

    constructor(private readonly router: Router,
                private readonly location: Location,
                private readonly route: RouteDataHandler,
                private readonly permission: PermissionService,
                private readonly peopleService: PeopleService) {
    }

    public ngOnInit(): void {
        this.resolverSubscription = this.route.getData<Person | CreateMarkerType>('person').subscribe(
            personInfo => {
                this.setUp(personInfo);
            }
        );
    }

    public ngOnDestroy(): void {
        this.resolverSubscription?.unsubscribe();
    }

    protected isEditMode(): boolean {
        return this.isEdit || this.isCreation;
    }

    protected savePerson(data: PersonRewrite | PersonCreation): void {
        this.createSaveRequest(data).subscribe(person => {
            this.person = person;
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
        if (data instanceof PersonRewrite) {
            return this.peopleService.updatePerson(this.person!.id, data);
        }
        if (data instanceof PersonCreation) {
            return this.peopleService.addPerson(data).pipe(tap(person => this.setIdInUrl(person.id)));
        }
        return throwError(() => new Error('Invalid data to save.'));
    }

    private setIdInUrl(personId: string): void {
        this.location.replaceState(`${PATHS.people.main}/${personId}`);
    }

    private setEditEnableValue(): void {
        if (isNil(this.person)) {
            this.isEditEnabled = true;
            return;
        }
        if (this.isActualPersonSelf()) {
            this.isEditEnabled = this.permission.has(Permission.canWriteSelf);
            return;
        }
        this.isEditEnabled = this.person.user?.roles.every(role => {
            const neededPermission = getPermissionsNeededToChangeRole(role);
            return this.permission.has(neededPermission);
        }) ?? false;
    }

}
