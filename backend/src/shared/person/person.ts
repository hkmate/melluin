import { BriefUser } from '@shared/user/user';
import { IsBoolean, IsOptional } from 'class-validator';
import {OperationCity} from '@shared/person/operation-city';


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

export class PersonPreferences {

    @IsBoolean()
    @IsOptional()
    canVolunteerSeeMyPhone?: boolean;

    @IsBoolean()
    @IsOptional()
    canVolunteerSeeMyEmail?: boolean;

    public static createDefault(): PersonPreferences {
        const value = new PersonPreferences();
        value.canVolunteerSeeMyEmail = false;
        value.canVolunteerSeeMyPhone = false;
        return value;
    }

}
