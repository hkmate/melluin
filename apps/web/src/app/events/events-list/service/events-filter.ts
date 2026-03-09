import {UUID, VisitStatus} from '@melluin/common';

export class EventsFilter {

    public dateFrom: Date;
    public dateTo: Date;
    public participantIds: Array<UUID>;
    public statuses: Array<VisitStatus>;
    public departmentIds: Array<UUID>;

    public get dateFromStr(): string {
        return this.dateFrom.toISOString();
    }

    public get dateToStr(): string {
        return this.dateTo.toISOString();
    }

}
