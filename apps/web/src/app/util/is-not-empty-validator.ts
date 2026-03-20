import {AbstractControl, ValidationErrors} from '@angular/forms';
import {isNilOrEmpty} from '@melluin/common';

export function isNotEmptyValidator(control: AbstractControl): ValidationErrors | null {
    return isNilOrEmpty(control.value)
        ? {empty: true}
        : null;
}
