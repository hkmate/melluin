import {catchError, OperatorFunction} from 'rxjs';
import {MessageService} from '@fe/app/util/message.service';
import {AbstractControl, ValidationErrors} from '@angular/forms';
import {ApiError, isNilOrEmpty} from '@melluin/common';
import {HttpErrorResponse} from '@angular/common/http';

// eslint-disable-next-line max-lines-per-function
function logErrorToUser(error: HttpErrorResponse, msg: MessageService): void {
    if (error.status === 0) {
        msg.error('NoBackendError');
        return;
    }
    if ('code' in error.error) {
        const code = error.error.code as ApiError;
        msg.error(`ApiErrors.${code}`);
        return;
    }
    if ('message' in error.error) {
        const message = error.error.message instanceof Array ? error.error.message.join(',') : error.error.message;
        msg.errorRaw(message);
        return;
    }
    msg.errorRaw(error?.message ?? error);
}

export function getErrorHandler<T>(msg: MessageService): OperatorFunction<T, T> {
    return catchError((error: HttpErrorResponse) => {
        logErrorToUser(error, msg);
        throw error;
    });
}

export function isNotEmptyValidator(control: AbstractControl): ValidationErrors | null {
    return isNilOrEmpty(control.value)
        ? {empty: true}
        : null;
}

export function isUUID(value: string | undefined | null): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value ?? '');
}
