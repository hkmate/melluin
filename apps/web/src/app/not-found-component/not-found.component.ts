import {Component, inject} from '@angular/core';
import {ActivatedRoute, Data, RouterLink} from '@angular/router';
import {first} from 'rxjs/operators';
import {AppTitle} from '@fe/app/app-title.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
    selector: 'app-not-found-component',
    templateUrl: './not-found.component.html',
    imports: [
        TranslatePipe,
        RouterLink
    ]
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
