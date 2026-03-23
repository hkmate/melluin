import {UUID, VisitStatus} from '@melluin/common';

export interface EventsFilter {

    dateFrom: Date;
    dateTo: Date;
    participantIds: Array<UUID>;
    statuses: Array<VisitStatus>;
    departmentIds: Array<UUID>;

}
