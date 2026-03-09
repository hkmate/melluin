import {OperationCity} from '../person/operation-city';
import {UUID} from '../util/type/uuid.type';

export interface Department {

    id: UUID;
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
