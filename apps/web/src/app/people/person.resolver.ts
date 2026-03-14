import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {catchError, Observable, of} from 'rxjs';
import {cast, isNilOrEmpty, Permission, Person, UUID} from '@melluin/common';
import {PeopleService} from '@fe/app/people/people.service';
import {CREATE_MARKER, CreateMarkerType, PATHS} from '@fe/app/app-paths';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {isUUID} from '@fe/app/util/util';

@Injectable()
export class PersonResolver implements Resolve<Person | CreateMarkerType | undefined> {

    private readonly router = inject(Router);
    private readonly permissions = inject(PermissionService);
    private readonly peopleService = inject(PeopleService);

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
            return of(CREATE_MARKER);
        }
        return this.getPerson(personId);
    }

    private getPerson(personId: UUID): Observable<Person | undefined> {
        return this.peopleService.getPerson(personId)
            .pipe(catchError(error => {
                console.debug('No person found error: ', error);
                this.router.navigate([PATHS.people.main]);
                return of(undefined);
            }));
    }

    private validatePersonId(id?: string): asserts id is (UUID | CreateMarkerType) {
        if (isNilOrEmpty(id)) {
            throw new Error('Person ID must not be empty.');
        }
        if (!isUUID(id) && id !== CREATE_MARKER) {
            throw new Error('Person ID must be UUID or "new".')
        }
        if (isUUID(id)
            && id === this.permissions.personId
            && !this.permissions.has(Permission.canWriteSelf)) {
            throw new Error('You cannot change your own person object.')
        }
    }

}
