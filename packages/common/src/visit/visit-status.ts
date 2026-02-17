export enum VisitStatus {

    DRAFT = 'DRAFT',
    SCHEDULED = 'SCHEDULED',

    STARTED = 'STARTED',

    ACTIVITIES_FILLED_OUT = 'ACTIVITIES_FILLED_OUT',
    ALL_FILLED_OUT = 'ALL_FILLED_OUT',

    CANCELED = 'CANCELED',
    FAILED_BECAUSE_NO_CHILD = 'FAILED_BECAUSE_NO_CHILD',
    FAILED_FOR_OTHER_REASON = 'FAILED_FOR_OTHER_REASON',
    SUCCESSFUL = 'SUCCESSFUL'

}

export function visitStatusOrders(): Record<VisitStatus, number> {
    return {
        [VisitStatus.DRAFT]: 1,
        [VisitStatus.SCHEDULED]: 2,
        [VisitStatus.STARTED]: 10,

        [VisitStatus.ACTIVITIES_FILLED_OUT]: 11,
        [VisitStatus.ALL_FILLED_OUT]: 12,
        [VisitStatus.SUCCESSFUL]: 20,

        [VisitStatus.CANCELED]: 30,
        [VisitStatus.FAILED_BECAUSE_NO_CHILD]: 31,
        [VisitStatus.FAILED_FOR_OTHER_REASON]: 32,
    };
}

export function getFailedStatuses(): Array<VisitStatus> {
    return [
        VisitStatus.CANCELED,
        VisitStatus.FAILED_BECAUSE_NO_CHILD,
        VisitStatus.FAILED_FOR_OTHER_REASON
    ];
}
