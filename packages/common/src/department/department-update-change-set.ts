import {OperationCity} from '../person/operation-city';

export interface DepartmentUpdateChangeSet {

    name?: string;
    validTo?: string;
    address?: string;
    city?: OperationCity;
    limitOfVisits?: number;
    vicariousMomIncludedInLimit?: boolean;
    diseasesInfo?: string;
    note?: string;

}
