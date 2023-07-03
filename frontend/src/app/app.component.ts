import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AppLanguage} from './language/app-language';
import {Store} from '@ngrx/store';
import {AppActions} from '@fe/app/state/app-actions';

@Component({
    selector: 'app-root',
    template: '<app-menu><router-outlet></router-outlet></app-menu>'
})
export class AppComponent implements OnInit {

    constructor(private readonly translate: TranslateService,
                private readonly store: Store) {
    }

    public ngOnInit(): void {
        this.translate.addLangs(Object.values(AppLanguage));
        this.store.dispatch(AppActions.appStarts());
    }

}
