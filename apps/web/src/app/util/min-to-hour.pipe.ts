import {Pipe, PipeTransform} from '@angular/core';
import {isNotNil} from '@shared/util/util';
import * as _ from 'lodash';

@Pipe({
    name: 'minToHour',
    standalone: true
})
export class MinToHourPipe implements PipeTransform {

    private static readonly MIN_ON_HOUR = 60;
    private static readonly DECIMALS = 2;

    public transform(value?: number): number | undefined {
        return isNotNil(value)
            ? _.round((value / MinToHourPipe.MIN_ON_HOUR), MinToHourPipe.DECIMALS)
            : undefined
    }

}
