import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {QuestionnaireComponent} from '@fe/app/questionnaire/questionnaire.component';
import {MatIconModule} from '@angular/material/icon';
import {CopierComponent} from '@fe/app/util/copier/copier.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,

        TranslateModule,
        MatIconModule,
        CopierComponent,
    ],
    declarations: [QuestionnaireComponent]
})
export class QuestionnaireModule {
}
