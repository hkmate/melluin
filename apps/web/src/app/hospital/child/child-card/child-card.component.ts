import {Component, Input} from '@angular/core';
import {DateUtil, isNotNil, VisitedChild} from '@melluin/common';

@Component({
    selector: 'app-child-card',
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
