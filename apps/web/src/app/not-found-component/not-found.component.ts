import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {ActivatedRoute, Data, RouterLink} from '@angular/router';
import {first} from 'rxjs/operators';
import {AppTitle} from '@fe/app/app-title.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
    imports: [
        TranslatePipe,
        RouterLink
    ],
    selector: 'app-not-found-component',
    templateUrl: './not-found.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent {

    private readonly route = inject(ActivatedRoute);
    private readonly title = inject(AppTitle);

    protected readonly path = signal<string | undefined>(undefined);

    constructor() {
        this.title.setTitleByI18n('Titles.NotFound');

        this.route.data
            .pipe(first())
            .subscribe((data: Data): void => {
                this.path.set(data.path);
            });
    }

}
