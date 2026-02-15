import {OperationCity} from '../person/operation-city';

export interface DepartmentCreation {

    name: string;
    validFrom: Date;
    validTo?: Date;
    address: string;
    city: OperationCity;
    limitOfVisits: number;
    vicariousMomIncludedInLimit: boolean;
    diseasesInfo?: string;
    note?: string;

}
