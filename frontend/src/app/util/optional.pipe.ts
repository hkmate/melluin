import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {isNotNil} from '@shared/util/util';

@Pipe({
    name: 'optional',
    standalone: true
})
export class OptionalPipe implements PipeTransform {

    constructor(private readonly i18n: TranslateService) {
    }

    public transform(value: unknown): string {
        return isNotNil(value) ? value : this.i18n.instant('NoData');
    }

}
