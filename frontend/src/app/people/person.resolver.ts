import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {catchError, Observable, of} from 'rxjs';
import {Person} from '@shared/person/person';
import {PeopleService} from '@fe/app/people/people.service';
import {isNilOrEmpty} from '@shared/util/util';
import {isUUID} from 'class-validator';
import {CreateMarkerType, CREATE_MARKER, PATHS} from '@fe/app/app-paths';
import {cast} from '@shared/util/test-util';

@Injectable({
    providedIn: 'root'
})
export class PersonResolver implements Resolve<Person | CreateMarkerType | undefined> {

    constructor(private readonly peopleService: PeopleService,
                private readonly router: Router) {
    }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
        : Observable<Person | CreateMarkerType | undefined> {
        const personId: string = route.paramMap.get('id')!;
        try {
            return this.getPersonOrMarker(personId);
        } catch (e) {
            console.debug(cast<Error>(e).message);
            this.router.navigate([PATHS.people.main])
            return of(undefined);
        }
    }

    private getPersonOrMarker(personId: string): Observable<Person | CreateMarkerType | undefined> {
        this.validatePersonId(personId);

        if (personId === CREATE_MARKER) {
            console.log('Emit create marker');
            return of(CREATE_MARKER);
        }
        return this.getPerson(personId);
    }

    private getPerson(personId: string): Observable<Person | undefined> {
        return this.peopleService.getPerson(personId)
            .pipe(catchError(error => {
                console.debug('No person found error: ', error);
                this.router.navigate([PATHS.people.main]);
                return of(undefined);
            }));
    }

    private validatePersonId(id?: string): void {
        if (isNilOrEmpty(id)) {
            throw new Error('Person ID must not be empty.');
        }
        if (!isUUID(id) && id !== CREATE_MARKER) {
            throw new Error('Person ID must be UUID or "new".')
        }
    }

}