import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AppLanguage} from './language/app-language';

@Component({
    selector: 'app-root',
    template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {

    constructor(private readonly translate: TranslateService) {
    }

    public ngOnInit(): void {
        this.translate.addLangs(Object.values(AppLanguage));
    }

}
