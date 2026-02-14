import {IsBoolean, IsOptional} from 'class-validator';
import {PersonPreferences} from '@shared/person/person-preferences';

export class PersonPreferencesValidatedInput implements PersonPreferences {

    @IsBoolean()
    @IsOptional()
    canVolunteerSeeMyPhone?: boolean;

    @IsBoolean()
    @IsOptional()
    canVolunteerSeeMyEmail?: boolean;

}
