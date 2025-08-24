import {catchError, OperatorFunction, throwError} from 'rxjs';
import {MessageService} from '@fe/app/util/message.service';
import {AbstractControl, ValidationErrors} from '@angular/forms';
import {isNilOrEmpty} from '@shared/util/util';
import {HttpErrorResponse} from '@angular/common/http';

export function utf8ToBase64(str: string): string {
    return window.btoa(unescape(encodeURIComponent(str)));
}

export function getErrorHandler<T>(msg: MessageService): OperatorFunction<T, T> {
    return catchError((error: HttpErrorResponse) => {
        if (error.status === 0) {
            msg.error('NoBackendError');
        } else if ('message' in error.error) {
            if (error.error.message instanceof Array) {
                msg.errorRaw((error.error.message as Array<string>).join(','));
            }
            msg.errorRaw(error.error.message);
        } else {
            msg.errorRaw(error?.message ?? error);
        }
        return throwError(error);
    });
}

export function isNotEmptyValidator(control: AbstractControl): ValidationErrors | null {
    return isNilOrEmpty(control.value)
        ? {empty: true}
        : null;
}
