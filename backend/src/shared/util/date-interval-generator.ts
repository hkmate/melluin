import {EventsDateFilter} from '@shared/user/user-settings';
import {DateInterval, DateUtil} from '@shared/util/date-util';

const WEEKDAYS = 7;

export interface DateIntervalGenerator {
    generate(): DateInterval;
}

export function dateIntervalGeneratorFactory(dateFilter: EventsDateFilter): DateIntervalGenerator {
    switch (dateFilter) {
        case EventsDateFilter.MONTH:
            return new ActualMonthDateIntervalGenerator();
        case EventsDateFilter.THREE_WEEK:
            return new ThreeWeeksDateIntervalGenerator();
        case EventsDateFilter.TWO_WEEK:
            return new TwoWeeksDateIntervalGenerator();
        case EventsDateFilter.WEEK:
            return new ActualWeekDateIntervalGenerator();
        default:
            throw new Error(`Unknown date filter type: ${dateFilter}`);
    }
}


export class ActualMonthDateIntervalGenerator implements DateIntervalGenerator {

    public generate(): DateInterval {
        return {dateFrom: this.getStartOfMonth(), dateTo: this.getEndOfTheMonth()};
    }

    private getStartOfMonth(): Date {
        const date = DateUtil.now();
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
        return date;
    }

    private getEndOfTheMonth(): Date {
        const date = DateUtil.now();
        date.setMonth(date.getMonth() + 1, 1);
        date.setHours(0, 0, 0, 0);
        return date;
    }

}

export class ActualWeekDateIntervalGenerator implements DateIntervalGenerator {

    public generate(): DateInterval {
        return {dateFrom: this.getStartOfWeek(), dateTo: this.getEndOfTheWeek()};
    }

    protected getStartOfWeek(): Date {
        const date = DateUtil.now();
        date.setDate(date.getDate() - date.getDay() + 1); // Note: +1 needed because Js use sunday as first of the week
        date.setHours(0, 0, 0, 0);
        return date;
    }

    protected getEndOfTheWeek(): Date {
        const date = DateUtil.now();
        date.setDate(date.getDate() + WEEKDAYS - date.getDay());
        date.setHours(0, 0, 0, 0);
        return date;
    }

}

export class TwoWeeksDateIntervalGenerator extends ActualWeekDateIntervalGenerator {

    public override generate(): DateInterval {
        return {dateFrom: this.getStartOfWeek(), dateTo: this.getEndOfNextWeek()};
    }

    protected getEndOfNextWeek(): Date {
        const date = this.getEndOfTheWeek();
        date.setDate(date.getDate() + WEEKDAYS);
        return date;
    }

}

export class ThreeWeeksDateIntervalGenerator extends TwoWeeksDateIntervalGenerator {

    public override generate(): DateInterval {
        return {dateFrom: this.getStartOfPreviousWeek(), dateTo: this.getEndOfNextWeek()};
    }

    protected getStartOfPreviousWeek(): Date {
        const date = this.getStartOfWeek();
        date.setDate(date.getDate() - WEEKDAYS);
        return date;
    }

}
