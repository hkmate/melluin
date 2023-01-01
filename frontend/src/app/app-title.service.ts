import {Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';

@Injectable({providedIn: 'root'})
export class AppTitle {

    constructor(private readonly title: Title,
                private readonly translate: TranslateService) {
    }

    public setTitleByI18n(i18nKey: string): void {
        this.title.setTitle(
            this.translate.instant(i18nKey)
            + ' - '
            + this.translate.instant('Titles.Base')
        );
    }

}
