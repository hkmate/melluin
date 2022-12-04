import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard.component';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule,
    ],
    declarations: [DashboardComponent]
})
export class DashboardModule {
}
