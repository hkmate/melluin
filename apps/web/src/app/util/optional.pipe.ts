import {inject, Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {isNotNil} from '@shared/util/util';

@Pipe({
    name: 'optional',
    standalone: true
})
export class OptionalPipe implements PipeTransform {

    private readonly i18n = inject(TranslateService);

    public transform<T>(value?: T, message?: string): string | T {
        return isNotNil(value) ? value : this.getMessage(message);
    }

    private getMessage(message?: string): string {
        return isNotNil(message) ? message : this.getDefaultMsg();
    }

    private getDefaultMsg(): string {
        return this.i18n.instant('NoData');
    }

}
