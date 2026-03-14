import {AbstractControl, ValidationErrors} from '@angular/forms';
import {isNilOrEmpty} from '@melluin/common';

export function isNotEmptyValidator(control: AbstractControl): ValidationErrors | null {
    return isNilOrEmpty(control.value)
        ? {empty: true}
        : null;
}

export function isUUID(value: string | undefined | null): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value ?? '');
}
