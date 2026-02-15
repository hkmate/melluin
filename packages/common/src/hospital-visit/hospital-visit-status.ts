export enum HospitalVisitStatus {

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

export function visitStatusOrders(): Record<HospitalVisitStatus, number> {
    return {
        [HospitalVisitStatus.DRAFT]: 1,
        [HospitalVisitStatus.SCHEDULED]: 2,
        [HospitalVisitStatus.STARTED]: 10,

        [HospitalVisitStatus.ACTIVITIES_FILLED_OUT]: 11,
        [HospitalVisitStatus.ALL_FILLED_OUT]: 12,
        [HospitalVisitStatus.SUCCESSFUL]: 20,

        [HospitalVisitStatus.CANCELED]: 30,
        [HospitalVisitStatus.FAILED_BECAUSE_NO_CHILD]: 31,
        [HospitalVisitStatus.FAILED_FOR_OTHER_REASON]: 32,
    };
}

export function getFailedStatuses(): Array<HospitalVisitStatus> {
    return [
        HospitalVisitStatus.CANCELED,
        HospitalVisitStatus.FAILED_BECAUSE_NO_CHILD,
        HospitalVisitStatus.FAILED_FOR_OTHER_REASON
    ];
}
