import {Pipe, PipeTransform} from '@angular/core';
import {isNotNil} from '@shared/util/util';

@Pipe({
    name: 'minToHour',
    standalone: true
})
export class MinToHourPipe implements PipeTransform {

    private static readonly MIN_ON_HOUR = 60;

    public transform(value?: number): number | undefined {
        return isNotNil(value)
            ? (value / MinToHourPipe.MIN_ON_HOUR)
            : undefined;
    }

}
