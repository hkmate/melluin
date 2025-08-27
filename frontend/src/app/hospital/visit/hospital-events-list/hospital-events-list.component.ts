import {Component, input} from '@angular/core';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {DateUtil} from '@shared/util/date-util';

@Component({
    selector: 'app-hospital-events-list',
    templateUrl: './hospital-events-list.component.html',
    styleUrls: ['./hospital-events-list.component.scss']
})
export class HospitalEventsListComponent {

    protected readonly columns = ['status', 'date', 'department', 'participants', 'options'];

    public readonly markRowByDate = input.required<boolean>();
    public readonly eventsList = input.required< Array<HospitalVisit>>();

    private todayDawn = DateUtil.truncateToDay(DateUtil.now()).toISOString();
    private tomorrowDawn = this.getTomorrowDawn();

    protected isFillButtonNeeded(visit: HospitalVisit): boolean {
        return [HospitalVisitStatus.SCHEDULED, HospitalVisitStatus.STARTED].includes(visit.status);
    }

    protected isBeforeToday(visit: HospitalVisit): boolean {
        return visit.dateTimeTo < this.todayDawn;
    }

    protected isInToday(visit: HospitalVisit): boolean {
        return this.todayDawn < visit.dateTimeFrom
            && visit.dateTimeTo < this.tomorrowDawn;
    }

    protected isAfterToday(visit: HospitalVisit): boolean {
        return this.tomorrowDawn < visit.dateTimeFrom;
    }

    private getTomorrowDawn(): string {
        const date = DateUtil.now();
        date.setDate(date.getDate() + 1);
        return DateUtil.truncateToDay(date).toISOString();
    }

}
