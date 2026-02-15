import {OperationCity} from '@melluin/common';

export interface StatFilter {
    from: string; // ISO date time string
    to: string; // ISO date time string
    city: OperationCity
}
