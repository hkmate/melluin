import {Component} from '@angular/core';
import {RouteDataHandler} from '@fe/app/util/route-data-handler/route-data-handler';
import {environment} from '@fe/environment';
import {CopierComponent} from '@fe/app/util/copier/copier.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
    selector: 'app-questionnaire',
    templateUrl: './questionnaire.component.html',
    styleUrls: ['./questionnaire.component.scss'],
    imports: [
        CopierComponent,
        TranslatePipe
    ],
    providers: [RouteDataHandler]
})
export class QuestionnaireComponent {

    protected linkForChild = environment.questionnaireForChild;
    protected linkForParent = environment.questionnaireForParent;

}
