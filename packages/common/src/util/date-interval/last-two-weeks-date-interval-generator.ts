import {WEEKDAYS} from './date-interval-generator';
import {LastWeeksDateIntervalGenerator} from './last-weeks-date-interval-generator';
import {DateInterval} from '../type/date-interval';

export class LastTwoWeeksDateIntervalGenerator extends LastWeeksDateIntervalGenerator {

    public override generate(): DateInterval {
        return {dateFrom: this.getTheDayBeforeTwoWeeks(), dateTo: this.getToday()};
    }

    protected getTheDayBeforeTwoWeeks(): Date {
        const date = this.getToday();
        date.setDate(date.getDate() - WEEKDAYS - WEEKDAYS);
        return date;
    }

}
