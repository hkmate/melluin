import {NgModule} from '@angular/core';
import {NotFoundComponent} from './not-found.component';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,

        TranslateModule,
    ],
    declarations: [NotFoundComponent],
    exports: [NotFoundComponent]
})
export class NotFoundPageModule {
}
