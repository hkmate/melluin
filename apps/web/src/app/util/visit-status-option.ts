import {VisitStatus, VisitStatuses} from '@melluin/common';

export interface SelectOption<T> {
    value: T;
    disabled?: boolean;
}

export function getAllStatusOptionsOnlyEnable(...enables: Array<VisitStatus>)
    : Array<SelectOption<VisitStatus>> {
    return Object.values(VisitStatuses)
        .map(status => ({value: status, disabled: !enables.includes(status)}));
}
