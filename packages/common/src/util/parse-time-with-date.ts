export function parseTimeWithDate(time: string, date: Date): Date {
    const [hour, min] = time.split(':');
    const dateTime = new Date(date);
    dateTime.setHours(+hour, +min, 0, 0);
    return dateTime;
}
