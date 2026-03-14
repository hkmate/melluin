import {inject, Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {isNil, Person} from '@melluin/common';
import {AppLanguages} from '@fe/app/language/app-language';
import {t} from '@fe/app/util/translate/translate';

@Pipe({name: 'personName'})
export class PersonNamePipe implements PipeTransform {

    private readonly i18n = inject(TranslateService);

    public transform(person: Person): string {
        if (isNil(person)) {
            return t('PersonPipe.NoPerson');
        }
        return this.getName(person);
    }

    private getName({firstName, lastName}: Person): string {
        if (this.i18n.getCurrentLang() === AppLanguages.HU) {
            return `${lastName} ${firstName}`;
        }
        return `${firstName} ${lastName}`;
    }

}
