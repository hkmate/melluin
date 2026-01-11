import {Component, inject} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AppLanguage} from './language/app-language';
import {Store} from '@ngrx/store';
import {AppActions} from '@fe/app/state/app-actions';
import {LoaderService} from '@fe/app/loader/loader.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styles: 'main {margin-top: 1rem}'
})
export class AppComponent {

    private readonly translate = inject(TranslateService);
    private readonly store = inject(Store);
    protected readonly loaderService = inject(LoaderService);

    constructor() {
        this.translate.addLangs(Object.values(AppLanguage));
        this.store.dispatch(AppActions.appStarts());
    }

}
