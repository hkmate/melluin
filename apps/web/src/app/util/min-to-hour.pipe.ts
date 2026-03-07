import {Pipe, PipeTransform} from '@angular/core';
import {isNotNil} from '@melluin/common';
import {round} from 'lodash-es';

@Pipe({
    name: 'minToHour'
})
export class MinToHourPipe implements PipeTransform {

    private static readonly MIN_ON_HOUR = 60;
    private static readonly DECIMALS = 2;

    public transform(value?: number): number | undefined {
        return isNotNil(value)
            ? round((value / MinToHourPipe.MIN_ON_HOUR), MinToHourPipe.DECIMALS)
            : undefined
    }

}
