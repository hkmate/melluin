import {inject, Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Person} from '@shared/person/person';
import {isNil} from '@shared/util/util';
import {AppLanguage} from '@fe/app/language/app-language';

@Pipe({
    name: 'personName',
    standalone: true
})
export class PersonNamePipe implements PipeTransform {

    private readonly i18n = inject(TranslateService);

    public transform(person: Person): string {
        if (isNil(person)) {
            return this.i18n.instant('PersonPipe.NoPerson');
        }
        return this.getName(person);
    }

    private getName({firstName, lastName}: Person): string {
        if (this.i18n.currentLang === AppLanguage.HU) {
            return `${lastName} ${firstName}`;
        }
        return `${firstName} ${lastName}`;
    }

}
