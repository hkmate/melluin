import {Pipe, PipeTransform} from '@angular/core';
import {isNotNil} from '@melluin/common';
import {t} from '@fe/app/util/translate/translate';

@Pipe({
    name: 'optional'
})
export class OptionalPipe implements PipeTransform {

    public transform<T>(value?: T, message?: string): string | T {
        return isNotNil(value) ? value : this.getMessage(message);
    }

    private getMessage(message?: string): string {
        return isNotNil(message) ? message : this.getDefaultMsg();
    }

    private getDefaultMsg(): string {
        return t('NoData');
    }

}
