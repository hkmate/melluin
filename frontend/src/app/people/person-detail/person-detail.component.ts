import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Person} from '@shared/person/person';
import {PersonUpdate} from '@shared/person/person-update';
import {PersonCreation} from '@shared/person/person-creation';
import {PeopleService} from '@fe/app/people/people.service';
import {CreateMarkerType, CREATE_MARKER, PATHS} from '@fe/app/app-paths';
import {Router} from '@angular/router';
import {RouteDataHandler} from '@fe/app/util/route-data-handler/route-data-handler';
import {Observable, tap, throwError} from 'rxjs';

@Component({
    selector: 'app-person-detail',
    templateUrl: './person-detail.component.html',
    styleUrls: ['./person-detail.component.scss'],
    providers: [RouteDataHandler]
})
export class PersonDetailComponent implements OnInit {

    protected isCreation = false;
    protected isEdit = false;
    protected person?: Person;

    constructor(private readonly router: Router,
                private readonly location: Location,
                private readonly route: RouteDataHandler,
                private readonly peopleService: PeopleService) {
    }

    public async ngOnInit(): Promise<void> {
        this.isEdit = this.route.getParam('edit') === 'true';
        await this.setUpInformation();
    }

    protected isEditMode(): boolean {
        return this.isEdit || this.isCreation;
    }

    protected savePerson(data: PersonUpdate | PersonCreation): void {
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

    private setToPresent(): void {
        this.isEdit = false;
        this.isCreation = false;
        this.route.removeParam('edit');
    }

    private async setUpInformation(): Promise<void> {
        const resolvedInfo = await this.route.getData<Person | CreateMarkerType>('person');
        if (resolvedInfo === CREATE_MARKER) {
            this.isCreation = true;
        } else {
            this.person = resolvedInfo;
        }
    }

    private createSaveRequest(data: PersonCreation | PersonUpdate): Observable<Person> {
        if (data instanceof PersonUpdate) {
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

}
