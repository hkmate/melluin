import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {TranslateModule} from '@ngx-translate/core';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule,

        TranslateModule,
        MatIconModule,
    ],
    declarations: [DashboardComponent]
})
export class DashboardModule {
}
