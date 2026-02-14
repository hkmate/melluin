import {catchError, OperatorFunction} from 'rxjs';
import {MessageService} from '@fe/app/util/message.service';
import {AbstractControl, ValidationErrors} from '@angular/forms';
import {isNilOrEmpty} from '@shared/util/util';
import {HttpErrorResponse} from '@angular/common/http';

export function utf8ToBase64(str: string): string {
    return window.btoa(unescape(encodeURIComponent(str)));
}

// eslint-disable-next-line max-lines-per-function
function logErrorToUser(error: HttpErrorResponse, msg: MessageService): void {
    if (error.status === 0) {
        msg.error('NoBackendError');
        return;
    }
    if ('code' in error.error) {
        msg.error(`ApiError.${error.error.code}`);
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
