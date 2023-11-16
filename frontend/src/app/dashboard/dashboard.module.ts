import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {TranslateModule} from '@ngx-translate/core';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule,

        MatIconModule,
        MatSidenavModule,

        TranslateModule
    ],
    declarations: [DashboardComponent]
})
export class DashboardModule {
}
