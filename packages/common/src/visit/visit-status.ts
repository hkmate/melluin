import {EnumTypeOf} from '../util/type/enum.type';

export const VisitStatuses = {
    DRAFT: 'DRAFT',
    SCHEDULED: 'SCHEDULED',

    STARTED: 'STARTED',

    ACTIVITIES_FILLED_OUT: 'ACTIVITIES_FILLED_OUT',
    ALL_FILLED_OUT: 'ALL_FILLED_OUT',

    CANCELED: 'CANCELED',
    FAILED_BECAUSE_NO_CHILD: 'FAILED_BECAUSE_NO_CHILD',
    FAILED_FOR_OTHER_REASON: 'FAILED_FOR_OTHER_REASON',
    SUCCESSFUL: 'SUCCESSFUL'
} as const;
export type VisitStatus = EnumTypeOf<typeof VisitStatuses>;

export function visitStatusOrders(): Record<VisitStatus, number> {
    return {
        [VisitStatuses.DRAFT]: 1,
        [VisitStatuses.SCHEDULED]: 2,
        [VisitStatuses.STARTED]: 10,

        [VisitStatuses.ACTIVITIES_FILLED_OUT]: 11,
        [VisitStatuses.ALL_FILLED_OUT]: 12,
        [VisitStatuses.SUCCESSFUL]: 20,

        [VisitStatuses.CANCELED]: 30,
        [VisitStatuses.FAILED_BECAUSE_NO_CHILD]: 31,
        [VisitStatuses.FAILED_FOR_OTHER_REASON]: 32,
    };
}

export function getFailedStatuses(): Array<VisitStatus> {
    return [
        VisitStatuses.CANCELED,
        VisitStatuses.FAILED_BECAUSE_NO_CHILD,
        VisitStatuses.FAILED_FOR_OTHER_REASON
    ];
}
