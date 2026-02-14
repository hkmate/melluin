import {DateInterval, DateUtil} from '@shared/util/date-util';

export enum DateIntervalSpecifier {
    WEEK = 'WEEK',  // Actual week
    TWO_WEEK = 'TWO_WEEK', // Actual + next week
    THREE_WEEK = 'THREE_WEEK', // Previous + actual + next week
    MONTH = 'MONTH', // Actual month
    LAST_WEEK = 'LAST_WEEK', // Last week
    LAST_TWO_WEEK = 'LAST_TWO_WEEK', // Last two weeks
    LAST_MONTH = 'LAST_MONTH', // Last month
}

const WEEKDAYS = 7;

export interface DateIntervalGenerator {
    generate(): DateInterval;
}

// eslint-disable-next-line max-lines-per-function
export function dateIntervalGeneratorFactory(intervalSpecifier: DateIntervalSpecifier): DateIntervalGenerator {
    switch (intervalSpecifier) {
        case DateIntervalSpecifier.MONTH:
            return new ActualMonthDateIntervalGenerator();
        case DateIntervalSpecifier.THREE_WEEK:
            return new ThreeWeeksDateIntervalGenerator();
        case DateIntervalSpecifier.TWO_WEEK:
            return new TwoWeeksDateIntervalGenerator();
        case DateIntervalSpecifier.WEEK:
            return new ActualWeekDateIntervalGenerator();
        case DateIntervalSpecifier.LAST_WEEK:
            return new LastWeeksDateIntervalGenerator();
        case DateIntervalSpecifier.LAST_TWO_WEEK:
            return new LastTwoWeeksDateIntervalGenerator();
        case DateIntervalSpecifier.LAST_MONTH:
            return new LastMonthDateIntervalGenerator();
        default:
            throw new Error(`Unknown date interval type: ${intervalSpecifier}`);
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
