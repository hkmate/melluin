import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Data} from '@angular/router';
import {first} from 'rxjs/operators';

@Component({
    selector: 'app-not-found-component',
    templateUrl: './not-found.component.html',
})
export class NotFoundComponent implements OnInit {

    protected path: string | null = null;

    constructor(private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.route.data
            .pipe(first())
            .subscribe((data: Data): void => {
                this.path = data.path;
            });
    }

}
