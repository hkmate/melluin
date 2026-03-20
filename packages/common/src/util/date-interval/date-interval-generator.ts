import {DateInterval} from '../type/date-interval';

export const WEEKDAYS = 7;

export interface DateIntervalGenerator {
    generate(): DateInterval;
}
