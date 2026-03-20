import {WEEKDAYS} from './date-interval-generator';
import {TwoWeeksDateIntervalGenerator} from './two-week-date-interval-generator';
import {DateInterval} from '../type/date-interval';

export class ThreeWeeksDateIntervalGenerator extends TwoWeeksDateIntervalGenerator {

    public override generate(): DateInterval {
        return {dateFrom: this.getFirstDayOfPreviousWeek(), dateTo: this.getLastDayOfNextWeek()};
    }

    protected getFirstDayOfPreviousWeek(): Date {
        const date = this.getFirstDayOfWeek();
        date.setDate(date.getDate() - WEEKDAYS);
        return date;
    }

}

