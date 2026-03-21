import {inject, Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {catchError, from, Observable, switchMap, throwError} from 'rxjs';
import {ApiError, ApiErrors, isNotNil, Permission, Visit, VisitCreate, VisitRewrite} from '@melluin/common';
import {MessageService} from '@fe/app/util/message.service';
import {VisitService} from '@fe/app/hospital/visit/visit.service';
import {ConfirmationService} from '@fe/app/confirmation/confirmation.service';
import {PermissionService} from '@fe/app/auth/service/permission.service';

@Injectable()
export class VisitFormSaveService {

    private readonly visitService = inject(VisitService);
    private readonly confirm = inject(ConfirmationService);
    private readonly msg = inject(MessageService);
    private readonly permission = inject(PermissionService);

    public saveVisit(visit: VisitCreate | VisitRewrite): Observable<Visit> {
        return this.saveVisitWithOptions(visit, {forceSameTimeVisit: false});
    }

    private saveVisitWithOptions(data: VisitCreate | VisitRewrite, options: {
        forceSameTimeVisit: boolean
    }): Observable<Visit> {
        return this.createSaveRequest(data, options).pipe(
            catchError(err => this.handleSaveError(data, err)))
    }

    private createSaveRequest(data: VisitCreate | VisitRewrite, options: {
        forceSameTimeVisit: boolean
    }): Observable<Visit> {
        if ('id' in data && isNotNil(data.id)) {
            return this.visitService.updateVisit(data as VisitRewrite, options);
        }
        return this.visitService.addVisit(data as VisitCreate, options);
    }

    private handleSaveError(dataToSave: VisitRewrite | VisitCreate, error: HttpErrorResponse): Observable<Visit> {
        if (!('code' in error.error)) {
            this.msg.errorRaw(error.message);
            return throwError(() => error.error);
        }
        const code = error.error.code as ApiError;
        if (code === ApiErrors.VISIT_SAME_TIME_SAME_DEPARTMENT_LIMIT_EXCEEDED) {
            return this.handleLimitExceededSaveError(dataToSave);
        }
        this.msg.error(`ApiErrors.${code}`);
        return throwError(() => code);
    }

    private handleLimitExceededSaveError(dataToSave: VisitRewrite | VisitCreate): Observable<Visit> {
        if (!this.permission.has(Permission.canForceSameTimeVisitWrite)) {
            this.msg.error('ApiErrors.VISIT_SAME_TIME_SAME_DEPARTMENT_LIMIT_EXCEEDED');
            return throwError(() => ApiErrors.VISIT_SAME_TIME_SAME_DEPARTMENT_LIMIT_EXCEEDED);
        }
        return from(
            this.confirm.getI18nConfirm({
                title: 'Visit.Form.SameTimeErrorTitle',
                message: 'Visit.Form.SameTimeErrorMessage',
                okBtnText: 'Visit.Form.SameTimeErrorOkText'
            }))
            .pipe(
                switchMap(() => this.saveVisitWithOptions(dataToSave, {forceSameTimeVisit: true}))
            );
    }

}
