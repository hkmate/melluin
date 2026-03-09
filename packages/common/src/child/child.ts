import {UUID} from '../util/type/uuid.type';

export interface Child {

    id: UUID;
    name: string;
    guessedBirth: string;
    info?: string;

}

export interface ChildAge {
    years: number;
    months: number;
}

