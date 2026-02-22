import {Component} from '@angular/core';
import {RouteDataHandler} from '@fe/app/util/route-data-handler/route-data-handler';
import {environment} from '@fe/environment';

@Component({
    selector: 'app-questionnaire',
    templateUrl: './questionnaire.component.html',
    styleUrls: ['./questionnaire.component.scss'],
    providers: [RouteDataHandler]
})
export class QuestionnaireComponent {

    protected linkForChild = environment.questionnaireForChild;
    protected linkForParent = environment.questionnaireForParent;

}
