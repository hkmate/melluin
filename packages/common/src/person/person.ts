import { BriefUser } from '../user/user';
import {OperationCity} from './operation-city';
import {PersonPreferences} from './person-preferences';
import {UUID} from '../util/type/uuid.type';


export interface PersonIdentifier {
    id: UUID;
    firstName: string;
    lastName: string;
}

export interface Person extends PersonIdentifier {
    email?: string;
    phone?: string;
    user?: BriefUser;
    preferences?: PersonPreferences;
    created?: string;
    createdByPersonId?: UUID;
    cities?: Array<OperationCity>;
}


export function getFullName(person: PersonIdentifier): string {
    return `${person.lastName} ${person.firstName}`
}
