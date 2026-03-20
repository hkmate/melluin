import {parseTimeWithDate} from './parse-time-with-date';

export function parseTime(time: string): Date {
    return parseTimeWithDate(time, new Date());
}
