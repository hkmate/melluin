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

export class ActualWeekDateIntervalGenerator implements DateIntervalGenerator {

    public generate(): DateInterval {
        return {dateFrom: this.getFirstDayOfWeek(), dateTo: this.getLastDayOfWeek()};
    }

    protected getFirstDayOfWeek(): Date {
        const date = DateUtil.truncateToDay(DateUtil.now());
        date.setDate(date.getDate() - date.getDay() + 1
            -(date.getDay() === 0 ? WEEKDAYS : 0) // On Sunday we need to set it to last week
        );
        return date;
    }

    protected getLastDayOfWeek(): Date {
        const date = this.getFirstDayOfWeek();
        date.setDate(date.getDate() + WEEKDAYS - 1);
        return date;
    }

}

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
