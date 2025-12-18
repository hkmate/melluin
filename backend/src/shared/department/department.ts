import {OperationCity} from '@shared/person/operation-city';

export interface Department {

    id: string;
    name: string;
    validFrom: string;
    validTo?: string;
    address: string;
    city: OperationCity;
    diseasesInfo?: string;
    note?: string;

}
