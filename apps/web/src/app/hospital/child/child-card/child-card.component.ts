import {Component, input} from '@angular/core';
import {DateUtil, VisitedChild} from '@melluin/common';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle} from '@angular/material/card';
import {ParentInfoIconComponent} from '@fe/app/hospital/child/parent-info-icon/parent-info-icon.component';
import {ChildAgePipe} from '@fe/app/hospital/child/child-age/child-age.pipe';

@Component({
    imports: [
        MatCardHeader,
        MatCard,
        MatCardSubtitle,
        ParentInfoIconComponent,
        MatCardContent,
        ChildAgePipe
    ],
    selector: 'app-child-card',
    templateUrl: './child-card.component.html'
})
export class ChildCardComponent {

    public readonly date = input(DateUtil.now());
    public readonly child = input<VisitedChild>();

}
