import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {QuestionnaireModule} from '@fe/app/questionnaire/questionnaire.module';
import {QuestionnaireComponent} from '@fe/app/questionnaire/questionnaire.component';

const routes: Routes = [
    {
        path: '',
        component: QuestionnaireComponent,
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),

        QuestionnaireModule
    ],
    exports: [RouterModule]
})
export class QuestionnaireRoutingModule {
}
