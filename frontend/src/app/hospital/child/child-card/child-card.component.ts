import {Component, Input} from '@angular/core';
import {getChildAge} from '@shared/child/child-age-calculator';
import {isNil, isNotNil} from '@shared/util/util';
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
    protected ageYear?: number;
    protected ageMonths?: number;

    @Input()
    public set date(date: Date) {
        this.visitDate = date;
        this.setAge();
    }

    @Input()
    public set child(child: VisitedChild) {
        this.patientInfo = child;
        this.setAge();
    }

    protected needParentInfo(): boolean {
        return isNotNil(this.patientInfo?.isParentThere);
    }

    private setAge(): void {
        if (isNil(this.patientInfo)) {
            return;
        }
        const childAge = getChildAge(this.patientInfo.child, this.visitDate);
        this.ageYear = childAge.years;
        this.ageMonths = childAge.months;
    }

}
