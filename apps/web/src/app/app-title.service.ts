import {inject, Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';

@Injectable({providedIn: 'root'})
export class AppTitle {

    private readonly title = inject(Title);
    private readonly translate = inject(TranslateService);

    public setTitleByI18n(i18nKey: string): void {
        this.title.setTitle(
            this.translate.instant(i18nKey)
            + ' - '
            + this.translate.instant('Titles.Base')
        );
    }

}
