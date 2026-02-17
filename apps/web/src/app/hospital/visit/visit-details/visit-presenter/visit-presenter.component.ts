import {Component, input} from '@angular/core';
import {Visit} from '@melluin/common';

@Component({
    selector: 'app-visit-presenter',
    templateUrl: './visit-presenter.component.html',
    styleUrls: ['./visit-presenter.component.scss']
})
export class VisitPresenterComponent {

    public readonly visit = input.required<Visit>();

    protected selfLink(): string {
        return window.location.href;
    }

}
