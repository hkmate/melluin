import {getAllStatusOptionsOnlyEnable, SelectOption} from '@fe/app/util/visit-status-option';
import {VisitStatus, VisitStatuses} from '@melluin/common';

// eslint-disable-next-line max-lines-per-function
export function getStatusesCoordinatorChangeToFrom(currentStatus: VisitStatus): Array<SelectOption<VisitStatus>> {
    switch (currentStatus) {
    case VisitStatuses.DRAFT:
        return getAllStatusOptionsOnlyEnable(VisitStatuses.DRAFT, VisitStatuses.SCHEDULED);
    case VisitStatuses.SCHEDULED:
        return getAllStatusOptionsOnlyEnable(
            VisitStatuses.SCHEDULED,
            VisitStatuses.STARTED,
            VisitStatuses.CANCELED,
            VisitStatuses.FAILED_FOR_OTHER_REASON,
            VisitStatuses.FAILED_BECAUSE_NO_CHILD
        );
    case VisitStatuses.STARTED:
        return getAllStatusOptionsOnlyEnable(
            VisitStatuses.STARTED,
            VisitStatuses.ACTIVITIES_FILLED_OUT,
            VisitStatuses.CANCELED,
            VisitStatuses.FAILED_FOR_OTHER_REASON,
            VisitStatuses.FAILED_BECAUSE_NO_CHILD
        );
    case VisitStatuses.ACTIVITIES_FILLED_OUT:
        return getAllStatusOptionsOnlyEnable(VisitStatuses.STARTED,
            VisitStatuses.ACTIVITIES_FILLED_OUT, VisitStatuses.ALL_FILLED_OUT);
    default:
        return getAllStatusOptionsOnlyEnable(currentStatus);
    }
}

// eslint-disable-next-line max-lines-per-function
export function getStatusesVolunteerChangeToFrom(currentStatus: VisitStatus): Array<SelectOption<VisitStatus>> {
    switch (currentStatus) {
    case VisitStatuses.SCHEDULED:
        return getAllStatusOptionsOnlyEnable(
            VisitStatuses.SCHEDULED,
            VisitStatuses.STARTED,
            VisitStatuses.CANCELED,
            VisitStatuses.FAILED_FOR_OTHER_REASON,
            VisitStatuses.FAILED_BECAUSE_NO_CHILD
        );
    case VisitStatuses.STARTED:
        return getAllStatusOptionsOnlyEnable(
            VisitStatuses.STARTED,
            VisitStatuses.ACTIVITIES_FILLED_OUT,
            VisitStatuses.CANCELED,
            VisitStatuses.FAILED_FOR_OTHER_REASON,
            VisitStatuses.FAILED_BECAUSE_NO_CHILD
        );
    default:
        return getAllStatusOptionsOnlyEnable(currentStatus);
    }
}
