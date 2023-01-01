import {Component, OnInit} from '@angular/core';
import {AppTitle} from '@fe/app/app-title.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    constructor(private readonly title: AppTitle) {
    }

    public ngOnInit(): void {
        this.title.setTitleByI18n('Titles.Dashboard');
    }

}
