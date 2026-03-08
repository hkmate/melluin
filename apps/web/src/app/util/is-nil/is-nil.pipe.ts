import {Pipe, PipeTransform} from '@angular/core';
import {isNil} from '@melluin/common';

@Pipe({
    name: 'isNil'
})
export class IsNilPipe implements PipeTransform {

    public transform<T>(value: T | undefined | null): value is  undefined | null {
        return isNil(value);
    }

}
