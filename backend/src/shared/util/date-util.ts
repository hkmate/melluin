export class DateUtil {

    public static now(): Date {
        return new Date();
    }

    public static cmp(date1: Date | string | number, date2: Date | string | number): number {
        return (new Date(date1).getTime()) - (new Date(date2).getTime());
    }

}
