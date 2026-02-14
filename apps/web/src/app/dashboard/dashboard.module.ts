import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {TranslateModule} from '@ngx-translate/core';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {BoxInfoWidgetComponent} from '@fe/app/dashboard/widgets/box-info-widget/box-info-widget.component';
import {MatCardModule} from '@angular/material/card';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule,

        MatIconModule,
        MatCardModule,
        MatSidenavModule,

        TranslateModule
    ],
    declarations: [
        DashboardComponent,
        BoxInfoWidgetComponent
    ]
})
export class DashboardModule {
}
