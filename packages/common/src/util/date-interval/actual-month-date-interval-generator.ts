import {DateIntervalGenerator} from './date-interval-generator';
import {DateUtil} from '../date-util';
import {DateInterval} from '../type/date-interval';

export class ActualMonthDateIntervalGenerator implements DateIntervalGenerator {

    public generate(): DateInterval {
        return {dateFrom: this.getFirstDayOfMonth(), dateTo: this.getLastDayOfMonth()};
    }

    private getFirstDayOfMonth(): Date {
        const date = DateUtil.truncateToDay(DateUtil.now());
        date.setDate(1);
        return date;
    }

    private getLastDayOfMonth(): Date {
        const date = DateUtil.truncateToDay(DateUtil.now());
        date.setMonth(date.getMonth() + 1, 1);
        return date;
    }

}
