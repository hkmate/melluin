import {OperationCity} from '@shared/person/operation-city';
import {PersonPreferences} from '@shared/person/person-preferences';

export interface PersonCreation {

    firstName: string;
    lastName: string;
    preferences?: PersonPreferences;
    email?: string;
    phone?: string;
    cities: Array<OperationCity>;

}
