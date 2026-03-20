import {WEEKDAYS} from './date-interval-generator';
import {ActualWeekDateIntervalGenerator} from './actual-week-date-interval-generator';
import {DateInterval} from '../type/date-interval';

export class TwoWeeksDateIntervalGenerator extends ActualWeekDateIntervalGenerator {

    public override generate(): DateInterval {
        return {dateFrom: this.getFirstDayOfWeek(), dateTo: this.getLastDayOfNextWeek()};
    }

    protected getLastDayOfNextWeek(): Date {
        const date = this.getLastDayOfWeek();
        date.setDate(date.getDate() + WEEKDAYS);
        return date;
    }

}

