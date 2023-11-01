import {Component, Input} from '@angular/core';
import {isNotNil} from '@shared/util/util';
import {DateUtil} from '@shared/util/date-util';
import {VisitedChild} from '@shared/hospital-visit/visited-child';

@Component({
    selector: 'app-child-card',
    templateUrl: './child-card.component.html',
    styleUrls: ['./child-card.component.scss']
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
