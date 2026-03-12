import {EnumTypeOf} from '@melluin/common';

export const EventListQueryParams = {
    dateTo: 'dateTo',
    dateFrom: 'dateFrom',
    departmentIds: 'departmentIds',
    participantIds: 'participantIds',
    statuses: 'statuses',
    highlight: 'highlight'
} as const

export type EventListQueryParam = EnumTypeOf<typeof EventListQueryParams>;
