import {Component, Input} from '@angular/core';
import {DateUtil, isNotNil, VisitedChild} from '@melluin/common';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle} from '@angular/material/card';
import {ParentInfoIconComponent} from '@fe/app/hospital/child/parent-info-icon/parent-info-icon.component';
import {ChildAgePipe} from '@fe/app/hospital/child/child-age/child-age.pipe';

@Component({
    selector: 'app-child-card',
    imports: [
        MatCardHeader,
        MatCard,
        MatCardSubtitle,
        ParentInfoIconComponent,
        MatCardContent,
        ChildAgePipe
    ],
    templateUrl: './child-card.component.html'
})
export class ChildCardComponent {

    protected patientInfo?: VisitedChild;
    protected visitDate: Date = DateUtil.now();

    @Input()
    public set date(date: Date) {
        this.visitDate = date;
    }

    @Input()
    public set child(child: VisitedChild) {
        this.patientInfo = child;
    }

    protected needParentInfo(): boolean {
        return isNotNil(this.patientInfo?.isParentThere);
    }

}
