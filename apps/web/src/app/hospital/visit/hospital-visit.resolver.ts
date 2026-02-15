import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {catchError, Observable, of} from 'rxjs';
import {cast, HospitalVisit, isNilOrEmpty, Permission} from '@melluin/common';
import {isUUID} from 'class-validator';
import {CREATE_MARKER, CreateMarkerType, PATHS} from '@fe/app/app-paths';
import {HospitalVisitService} from '@fe/app/hospital/visit/hospital-visit.service';
import {PermissionService} from '@fe/app/auth/service/permission.service';

@Injectable({
    providedIn: 'root'
})
export class HospitalVisitResolver implements Resolve<HospitalVisit | CreateMarkerType | undefined> {

    private readonly router = inject(Router);
    private readonly visitService = inject(HospitalVisitService);
    private readonly permissions = inject(PermissionService);

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
        : Observable<HospitalVisit | CreateMarkerType | undefined> {
        const id: string = route.paramMap.get('id')!;
        try {
            return this.getPersonOrMarker(id);
        } catch (e) {
            console.debug(cast<Error>(e).message);
            this.router.navigate([PATHS.events.main])
            return of(undefined);
        }
    }

    private getPersonOrMarker(visitId: string): Observable<HospitalVisit | CreateMarkerType | undefined> {
        this.validateId(visitId);

        if (visitId === CREATE_MARKER) {
            console.log('Emit create marker');
            return of(CREATE_MARKER);
        }
        return this.getVisit(visitId);
    }

    private getVisit(visitId: string): Observable<HospitalVisit | undefined> {
        return this.visitService.getVisit(visitId)
            .pipe(catchError(error => {
                console.debug('No hospital visit found error: ', error);
                this.router.navigate([PATHS.events.main]);
                return of(undefined);
            }));
    }

    private validateId(id?: string): void {
        if (isNilOrEmpty(id)) {
            throw new Error('ID must not be empty.');
        }
        if (!isUUID(id) && id !== CREATE_MARKER) {
            throw new Error('ID must be UUID or "new".')
        }
        if (isUUID(id) && !this.permissions.has(Permission.canReadVisit)) {
            throw new Error(`You have no permission to read visit with id: ${id}.`)
        }
        if (id === CREATE_MARKER && !this.permissions.has(Permission.canCreateVisit)) {
            throw new Error('You have no permission to create visit.')
        }
    }

}
