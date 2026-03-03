import {Component, inject} from '@angular/core';
import {LoaderService} from '@fe/app/loader/loader.service';
import {MenuComponent} from '@fe/app/menu/menu.component';
import {MatProgressBar} from '@angular/material/progress-bar';
import {RouterOutlet} from '@angular/router';
import {TranslationRegistryService} from 'ngxsmk-datepicker';
import {getHungarianTranslations} from '@fe/app/util/datepicker/get-hungarian-datepicker-translations';

@Component({
    imports: [
        MenuComponent,
        MatProgressBar,
        RouterOutlet
    ],
    selector: 'app-root',
    templateUrl: './app.component.html',
    styles: 'main {margin-top: 1rem}'
})
export class AppComponent {

    protected readonly loaderService = inject(LoaderService);

    constructor() {
        inject(TranslationRegistryService).register('hu', getHungarianTranslations());
    }

}
