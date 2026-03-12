import {InterpolationParameters, TranslateService} from '@ngx-translate/core';
import {inject} from '@angular/core';
import {AppLanguages} from '@fe/app/language/app-language';
import {I18nKeys, translationHu} from '@fe/app/util/translate/i18n.type';

let translateService: TranslateService | undefined;

export function t(i18nKey: I18nKeys, params?: InterpolationParameters): string {
    return translateService?.instant(i18nKey, params) ?? i18nKey;
}

export function setupTranslateService(): void {
    translateService = inject(TranslateService);
    translateService.setTranslation(AppLanguages.HU, translationHu);
    translateService.use(AppLanguages.HU);
}
