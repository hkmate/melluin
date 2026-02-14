import {Component, OnInit} from '@angular/core';
import {RouteDataHandler} from '@fe/app/util/route-data-handler/route-data-handler';
import {AppConfig} from '@fe/app/config/app-config';

@Component({
    selector: 'app-questionnaire',
    templateUrl: './questionnaire.component.html',
    styleUrls: ['./questionnaire.component.scss'],
    providers: [RouteDataHandler]
})
export class QuestionnaireComponent implements OnInit {

    protected linkForChild?: string;
    protected linkForParent?: string;

    public ngOnInit(): void {
        this.linkForChild = AppConfig.get('questionnaireForChild');
        this.linkForParent = AppConfig.get('questionnaireForParent');
    }

}
