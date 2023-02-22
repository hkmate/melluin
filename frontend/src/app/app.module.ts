import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
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
import {MAT_DATE_LOCALE} from '@angular/material/core';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http);
}

export function appInitializeTranslateFactory(translate: TranslateService) {
    return () => firstValueFrom(translate.use(AppLanguage.HU));
}

@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent, MenuComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,

        MatSidenavModule,
        MatIconModule,
        MatListModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),

        AuthModule.forRoot(),
        DashboardModule,
        NotFoundPageModule,
        AppRoutingModule,
    ],
    providers: [
        {provide: PathProvider, useClass: MelluinPathProvider},
        {provide: PathContainer, useValue: PATHS},
        {provide: MatPaginatorIntl, useClass: I18nPaginatorIntl},
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializeTranslateFactory,
            deps: [TranslateService],
            multi: true
        },
        {provide: MAT_DATE_LOCALE, useValue: 'hu-HU'},
    ],
})
export class AppModule {
}
