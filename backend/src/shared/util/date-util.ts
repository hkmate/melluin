import {isNilOrEmpty} from '@shared/util/util';

export class DateUtil {

    public static now(): Date {
        return new Date();
    }

    public static cmp(date1: Date | string | number, date2: Date | string | number): number {
        return (new Date(date1).getTime()) - (new Date(date2).getTime());
    }

    public static parse(dateStr: string | undefined, defaultValue = DateUtil.now()): Date {
        if (isNilOrEmpty(dateStr)) {
            return new Date(defaultValue);
        }

        return new Date(dateStr!);
    }

    public static truncateToDay(date: Date): Date {
        const result = new Date(date);
        result.setHours(0, 0, 0, 0);
        return result;
    }

}
