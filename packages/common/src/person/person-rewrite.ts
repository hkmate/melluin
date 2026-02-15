import {OperationCity} from './operation-city';
import {PersonPreferences} from './person-preferences';

export interface PersonRewrite {

    firstName: string;
    lastName: string;
    preferences?: PersonPreferences;
    email?: string;
    phone?: string;
    cities: Array<OperationCity>;

}

