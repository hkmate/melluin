import {Component, inject} from '@angular/core';
import {ActivatedRoute, Data} from '@angular/router';
import {first} from 'rxjs/operators';
import {AppTitle} from '@fe/app/app-title.service';

@Component({
    selector: 'app-not-found-component',
    templateUrl: './not-found.component.html',
})
export class NotFoundComponent {

    private readonly route = inject(ActivatedRoute);
    private readonly title = inject(AppTitle);

    protected path?: string;

    constructor() {
        this.title.setTitleByI18n('Titles.NotFound');

        this.route.data
            .pipe(first())
            .subscribe((data: Data): void => {
                this.path = data.path;
            });
    }

}
