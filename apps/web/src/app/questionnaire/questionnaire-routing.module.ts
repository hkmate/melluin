import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {QuestionnaireComponent} from '@fe/app/questionnaire/questionnaire.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: QuestionnaireComponent,
            }
        ]),
    ],
    exports: [RouterModule]
})
export default class QuestionnaireRoutingModule {
}
