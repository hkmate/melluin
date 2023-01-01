import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Data} from '@angular/router';
import {first} from 'rxjs/operators';
import {Nullable} from '@shared/util/util';
import {AppTitle} from '@fe/app/app-title.service';

@Component({
    selector: 'app-not-found-component',
    templateUrl: './not-found.component.html',
})
export class NotFoundComponent implements OnInit {

    protected path: Nullable<string> = null;

    constructor(private readonly route: ActivatedRoute,
                private readonly title: AppTitle) {
    }

    public ngOnInit(): void {
        this.title.setTitleByI18n('Titles.NotFound');

        this.route.data
            .pipe(first())
            .subscribe((data: Data): void => {
                this.path = data.path;
            });
    }

}
