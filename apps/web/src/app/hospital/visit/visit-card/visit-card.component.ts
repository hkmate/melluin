import {Component, input} from '@angular/core';
import {Visit} from '@melluin/common';

@Component({
    selector: 'app-visit-card',
    templateUrl: './visit-card.component.html',
    styleUrls: ['./visit-card.component.scss']
})
export class VisitCardComponent {

    public readonly visit = input.required<Visit>();

}
