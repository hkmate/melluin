import {OperationCity} from '@shared/person/operation-city';

export interface StatFilter {
    from: string; // ISO date time string
    to: string; // ISO date time string
    city: OperationCity
}
