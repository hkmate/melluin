import {DateIntervalSpecifier, DateIntervalSpecifiers} from './date-interval-specifier';
import {DateIntervalGenerator} from './date-interval-generator';
import {ActualWeekDateIntervalGenerator} from './actual-week-date-interval-generator';
import {ActualMonthDateIntervalGenerator} from './actual-month-date-interval-generator';
import {ThreeWeeksDateIntervalGenerator} from './three-week-date-interval-generator';
import {TwoWeeksDateIntervalGenerator} from './two-week-date-interval-generator';
import {LastWeeksDateIntervalGenerator} from './last-weeks-date-interval-generator';
import {LastTwoWeeksDateIntervalGenerator} from './last-two-weeks-date-interval-generator';
import {LastMonthDateIntervalGenerator} from './last-months-date-interval-generator';

// eslint-disable-next-line max-lines-per-function
export function dateIntervalGeneratorFactory(intervalSpecifier: DateIntervalSpecifier): DateIntervalGenerator {
    switch (intervalSpecifier) {
        case DateIntervalSpecifiers.MONTH:
            return new ActualMonthDateIntervalGenerator();
        case DateIntervalSpecifiers.THREE_WEEK:
            return new ThreeWeeksDateIntervalGenerator();
        case DateIntervalSpecifiers.TWO_WEEK:
            return new TwoWeeksDateIntervalGenerator();
        case DateIntervalSpecifiers.WEEK:
            return new ActualWeekDateIntervalGenerator();
        case DateIntervalSpecifiers.LAST_WEEK:
            return new LastWeeksDateIntervalGenerator();
        case DateIntervalSpecifiers.LAST_TWO_WEEK:
            return new LastTwoWeeksDateIntervalGenerator();
        case DateIntervalSpecifiers.LAST_MONTH:
            return new LastMonthDateIntervalGenerator();
        default:
            throw new Error(`Unknown date interval type: ${intervalSpecifier}`);
    }
}
