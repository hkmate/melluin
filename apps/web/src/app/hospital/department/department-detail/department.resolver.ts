import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {catchError, Observable, of} from 'rxjs';
import {cast, Department, isNilOrEmpty, UUID} from '@melluin/common';
import {CREATE_MARKER, CreateMarkerType, PATHS} from '@fe/app/app-paths';
import {DepartmentService} from '@fe/app/hospital/department/department.service';
import {isUUID} from '@fe/app/util/util';

@Injectable({
    providedIn: 'root'
})
export class DepartmentResolver implements Resolve<Department | CreateMarkerType | undefined> {

    private readonly departmentService = inject(DepartmentService);
    private readonly router = inject(Router);

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
        : Observable<Department | CreateMarkerType | undefined> {
        const departmentId = route.paramMap.get('id')!;
        try {
            return this.getDepartmentOrMarker(departmentId);
        } catch (e) {
            console.debug(cast<Error>(e).message);
            this.router.navigate([PATHS.departments.main])
            return of(undefined);
        }
    }

    private getDepartmentOrMarker(departmentId: string): Observable<Department | CreateMarkerType | undefined> {
        this.validateDepartmentId(departmentId);

        if (departmentId === CREATE_MARKER) {
            return of(CREATE_MARKER);
        }
        return this.getDepartment(departmentId);
    }

    private getDepartment(departmentId: UUID): Observable<Department | undefined> {
        return this.departmentService.getDepartment(departmentId)
            .pipe(catchError(error => {
                console.debug('No department found error: ', error);
                this.router.navigate([PATHS.people.main]);
                return of(undefined);
            }));
    }

    private validateDepartmentId(id?: string): asserts id is (UUID | CreateMarkerType) {
        if (isNilOrEmpty(id)) {
            throw new Error('Department ID must not be empty.');
        }
        if (!isUUID(id) && id !== CREATE_MARKER) {
            throw new Error('Department ID must be UUID or "new".')
        }
    }

}
