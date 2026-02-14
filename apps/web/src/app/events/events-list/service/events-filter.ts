import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';

export class EventsFilter {

    public dateFrom: Date;
    public dateTo: Date;
    public participantIds: Array<string>;
    public statuses: Array<HospitalVisitStatus>;
    public departmentIds: Array<string>;

    public get dateFromStr(): string {
        return this.dateFrom.toISOString();
    }

    public get dateToStr(): string {
        return this.dateTo.toISOString();
    }

}
