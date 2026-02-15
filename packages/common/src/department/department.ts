import {OperationCity} from '../person/operation-city';

export interface Department {

    id: string;
    name: string;
    validFrom: string;
    validTo?: string;
    address: string;
    city: OperationCity;
    limitOfVisits: number;
    vicariousMomIncludedInLimit: boolean;
    diseasesInfo?: string;
    note?: string;

}
