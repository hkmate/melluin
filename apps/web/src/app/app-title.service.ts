import {inject, Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {t} from '@fe/app/util/translate/translate';
import {I18nKeys} from '@fe/app/util/translate/i18n.type';

@Injectable({providedIn: 'root'})
export class AppTitle {

    private readonly title = inject(Title);

    public setTitleByI18n(i18nKey: I18nKeys): void {
        this.title.setTitle(`${t(i18nKey)} - ${t('Titles.Base')}`);
    }

}
