import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';

export interface SelectOption<T> {
    value: T;
    disabled?: boolean;
}

export function getAllStatusOptionsOnlyEnable(...enables: Array<HospitalVisitStatus>)
    : Array<SelectOption<HospitalVisitStatus>> {
    return Object.values(HospitalVisitStatus)
        .map(status => ({value: status, disabled: !enables.includes(status)}));
}
