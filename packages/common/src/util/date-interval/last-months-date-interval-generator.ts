import {LastWeeksDateIntervalGenerator} from './last-weeks-date-interval-generator';
import {DateInterval} from '../type/date-interval';


export class LastMonthDateIntervalGenerator extends LastWeeksDateIntervalGenerator {

    public override generate(): DateInterval {
        return {dateFrom: this.getTheDayBeforeAMonth(), dateTo: this.getToday()};
    }

    protected getTheDayBeforeAMonth(): Date {
        const date = this.getToday();
        date.setMonth(date.getMonth() - 1);
        return date;
    }

}
