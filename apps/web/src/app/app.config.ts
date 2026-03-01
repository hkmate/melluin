import {
    ApplicationConfig,
    inject,
    LOCALE_ID,
    provideAppInitializer,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection
} from '@angular/core';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';
import {provideTranslateService, TranslateService} from '@ngx-translate/core';
import {MelluinPathProvider} from './app-paths';
import {PathProvider} from './path-resolve/path-resolve.service';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {I18nPaginatorIntl} from '@fe/app/util/i18n-paginator-intl';
import {DateAdapter, provideNativeDateAdapter} from '@angular/material/core';
import {registerLocaleData} from '@angular/common';
import localeHu from '@angular/common/locales/hu';
import {provideToastr} from 'ngx-toastr';
import {CredentialStoreService} from '@fe/app/auth/service/credential-store.service';
import {MondayFirstDateAdapter} from '@fe/app/util/monday-first-date-adapter';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {JwtInterceptor} from '@fe/app/auth/service/jwt.interceptor';
import {provideRouter} from '@angular/router';
import {routes} from '@fe/app/app-routes';
import {AppLanguage} from '@fe/app/language/app-language';

registerLocaleData(localeHu);

export const appConfig: ApplicationConfig = {
    providers: [

        // Temporarily use zone until signals is used everywhere
        provideZoneChangeDetection({eventCoalescing: true}),

        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        provideAppInitializer(() => inject(CredentialStoreService).init()),
        provideAppInitializer(() => inject(TranslateService).use(AppLanguage.HU)),

        provideHttpClient(withInterceptorsFromDi()),
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},

        provideTranslateService({
            fallbackLang: AppLanguage.HU,
        }),
        provideTranslateHttpLoader({
            prefix: './assets/i18n/',
            suffix: '.json',
            useHttpBackend: true
        }),

        provideToastr(),

        {provide: PathProvider, useClass: MelluinPathProvider},

        {provide: LOCALE_ID, useValue: AppLanguage.HU},
        provideNativeDateAdapter(),
        {provide: DateAdapter, useClass: MondayFirstDateAdapter},
        {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
        {provide: MatPaginatorIntl, useClass: I18nPaginatorIntl}
    ],
};
