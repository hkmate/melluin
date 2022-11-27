import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {DashboardModule} from './dashboard/dashboard.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NotFoundPageModule} from './not-found-component/not-found.module';
import {AuthModule} from './auth/auth.module';
import {MelluinPathProvider, PathContainer, PATHS} from './app-paths';
import {PathProvider} from './path-resolve/path-resolve.service';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http);
}

@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        TranslateModule.forRoot({
            defaultLanguage: 'hu',
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
        {provide: PathContainer, useValue: PATHS}
    ],
})
export class AppModule {
}
