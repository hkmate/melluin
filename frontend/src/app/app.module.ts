import {APP_INITIALIZER, isDevMode, LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpBackend, HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {DashboardModule} from './dashboard/dashboard.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NotFoundPageModule} from './not-found-component/not-found.module';
import {AuthModule} from './auth/auth.module';
import {MelluinPathProvider, PathContainer, PATHS} from './app-paths';
import {PathProvider} from './path-resolve/path-resolve.service';
import {MenuComponent} from './menu/menu.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {firstValueFrom} from 'rxjs';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {I18nPaginatorIntl} from '@fe/app/util/i18n-paginator-intl';
import {AppLanguage} from '@fe/app/language/app-language';
import {DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import {registerLocaleData} from '@angular/common';
import localeHu from '@angular/common/locales/hu';
import {ToastrModule} from 'ngx-toastr';
import {AppConfig, appConfigInitializerFn} from '@fe/app/config/app-config';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {currentUserKey, userSettingsKey} from '@fe/app/state/app.state';
import {CredentialStoreService} from '@fe/app/auth/service/credential-store.service';
import {ConfirmationModule} from '@fe/app/confirmation/confirmation.module';
import {userSettingsReducer} from '@fe/app/state/reducer/user-settings.reducer';
import {currentUserReducer} from '@fe/app/state/reducer/current-user.reducer';
import {UserDataSaverEffect} from '@fe/app/state/effect/user-data-saver.effect';
import {NavigatorComponent} from '@fe/app/navigator.component';
import {MondayFirstDateAdapter} from '@fe/app/util/monday-first-date-adapter';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';

registerLocaleData(localeHu);

export function HttpLoaderFactory(http: HttpBackend): TranslateHttpLoader {
    return new TranslateHttpLoader(new HttpClient(http));
}

export function appInitializeTranslateFactory(translate: TranslateService) {
    return () => firstValueFrom(translate.use(AppLanguage.HU));
}

export function appInitializeCredentialsFactory(credentialStoreService: CredentialStoreService) {
    return () => credentialStoreService.init();
}

@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent, NavigatorComponent, MenuComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,

        StoreModule.forRoot({
            [currentUserKey]: currentUserReducer,
            [userSettingsKey]: userSettingsReducer
        }),
        EffectsModule.forRoot(UserDataSaverEffect),
        StoreDevtoolsModule.instrument({maxAge: 25, logOnly: !isDevMode()}),

        MatSidenavModule,
        MatIconModule,
        MatListModule,
        MatNativeDateModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpBackend]
            }
        }),
        ToastrModule.forRoot(),

        AuthModule.forRoot(),
        ConfirmationModule.forRoot(),
        DashboardModule,
        NotFoundPageModule,
        AppRoutingModule,
    ],
    providers: [
        AppConfig,
        {
            provide: APP_INITIALIZER,
            useFactory: appConfigInitializerFn,
            multi: true,
            deps: [AppConfig]
        },
        {provide: PathProvider, useClass: MelluinPathProvider},
        {provide: PathContainer, useValue: PATHS},
        {provide: MatPaginatorIntl, useClass: I18nPaginatorIntl},
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializeTranslateFactory,
            deps: [TranslateService],
            multi: true
        },
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializeCredentialsFactory,
            deps: [CredentialStoreService],
            multi: true
        },
        {provide: MAT_DATE_LOCALE, useValue: 'hu-HU'},
        {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
        {provide: LOCALE_ID, useValue: 'hu'},
        {provide: DateAdapter, useClass: MondayFirstDateAdapter}
    ],
})
export class AppModule {
}
