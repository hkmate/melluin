import { BriefUser } from '@shared/user/user';
import {OperationCity} from '@shared/person/operation-city';
import {PersonPreferences} from '@shared/person/person-preferences';


export interface PersonIdentifier {
    id: string;
    firstName: string;
    lastName: string;
}

export interface Person extends PersonIdentifier {
    email?: string;
    phone?: string;
    user?: BriefUser;
    preferences?: PersonPreferences;
    created?: string;
    createdByPersonId?: string;
    cities?: Array<OperationCity>;
}


export function getFullName(person: PersonIdentifier): string {
    return `${person.lastName} ${person.firstName}`
}
