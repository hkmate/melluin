import {DateUtil} from '../date-util';
import {DateIntervalGenerator, WEEKDAYS} from './date-interval-generator';
import {DateInterval} from '../type/date-interval';

export class ActualWeekDateIntervalGenerator implements DateIntervalGenerator {

    public generate(): DateInterval {
        return {dateFrom: this.getFirstDayOfWeek(), dateTo: this.getLastDayOfWeek()};
    }

    protected getFirstDayOfWeek(): Date {
        const date = DateUtil.truncateToDay(DateUtil.now());
        date.setDate(date.getDate() - date.getDay() + 1
            - (date.getDay() === 0 ? WEEKDAYS : 0) // On Sunday we need to set it to last week
        );
        return date;
    }

    protected getLastDayOfWeek(): Date {
        const date = this.getFirstDayOfWeek();
        date.setDate(date.getDate() + WEEKDAYS - 1);
        return date;
    }

}
