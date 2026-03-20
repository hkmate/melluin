import {DateUtil} from '../date-util';
import {DateIntervalGenerator, WEEKDAYS} from './date-interval-generator';
import {DateInterval} from '../type/date-interval';

export class LastWeeksDateIntervalGenerator implements DateIntervalGenerator {

    public generate(): DateInterval {
        return {dateFrom: this.getTheDayBeforeAWeek(), dateTo: this.getToday()};
    }

    protected getTheDayBeforeAWeek(): Date {
        const date = this.getToday();
        date.setDate(date.getDate() - WEEKDAYS);
        return date;
    }

    protected getToday(): Date {
        return DateUtil.truncateToDay(DateUtil.now());
    }

}
