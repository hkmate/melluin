import {BriefUser} from '@shared/user/user';
import {IsBoolean, IsOptional} from 'class-validator';


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
}

export class PersonPreferences {

    @IsBoolean()
    @IsOptional()
    canVolunteerSeeMyPhone?: boolean;

    @IsBoolean()
    @IsOptional()
    canVolunteerSeeMyEmail?: boolean;

    public static createDefault(): PersonPreferences {
        const value =  new PersonPreferences();
        value.canVolunteerSeeMyEmail = false;
        value.canVolunteerSeeMyPhone = false;
        return value;
    }

}
