import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {catchError, Observable, of} from 'rxjs';
import {isNilOrEmpty} from '@shared/util/util';
import {isUUID} from 'class-validator';
import {CREATE_MARKER, CreateMarkerType, PATHS} from '@fe/app/app-paths';
import {cast} from '@shared/util/test-util';
import {Department} from '@shared/department/department';
import {DepartmentService} from '@fe/app/hospital/department/department.service';

@Injectable({
    providedIn: 'root'
})
export class DepartmentResolver implements Resolve<Department | CreateMarkerType | undefined> {

    constructor(private readonly departmentService: DepartmentService,
                private readonly router: Router) {
    }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
        : Observable<Department | CreateMarkerType | undefined> {
        const departmentId: string = route.paramMap.get('id')!;
        try {
            return this.getDepartmentOrMarker(departmentId);
        } catch (e) {
            console.debug(cast<Error>(e).message);
            this.router.navigate([PATHS.hospitalDepartments.main])
            return of(undefined);
        }
    }

    private getDepartmentOrMarker(departmentId: string): Observable<Department | CreateMarkerType | undefined> {
        this.validatePersonId(departmentId);

        if (departmentId === CREATE_MARKER) {
            console.log('Emit create marker');
            return of(CREATE_MARKER);
        }
        return this.getDepartment(departmentId);
    }

    private getDepartment(departmentId: string): Observable<Department | undefined> {
        return this.departmentService.getDepartment(departmentId)
            .pipe(catchError(error => {
                console.debug('No department found error: ', error);
                this.router.navigate([PATHS.people.main]);
                return of(undefined);
            }));
    }

    private validatePersonId(id?: string): void {
        if (isNilOrEmpty(id)) {
            throw new Error('Department ID must not be empty.');
        }
        if (!isUUID(id) && id !== CREATE_MARKER) {
            throw new Error('Department ID must be UUID or "new".')
        }
    }

}
