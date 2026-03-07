import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouteDataHandler} from '@fe/app/util/route-data-handler/route-data-handler';
import {environment} from '@fe/environment';
import {CopierComponent} from '@fe/app/util/copier/copier.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
    imports: [
        CopierComponent,
        TranslatePipe
    ],
    providers: [RouteDataHandler],
    selector: 'app-questionnaire',
    templateUrl: './questionnaire.component.html',
    styleUrls: ['./questionnaire.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionnaireComponent {

    protected linkForChild = environment.questionnaireForChild;
    protected linkForParent = environment.questionnaireForParent;

}
