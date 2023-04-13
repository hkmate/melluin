import {BriefUser} from '@shared/user/user';
import {IsBoolean, IsOptional} from 'class-validator';


export interface PersonIdentifier {
    id: string;
    firstName: string;
    lastName: string;
    nickName?: string;
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

}
