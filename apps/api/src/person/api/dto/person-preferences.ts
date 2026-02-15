import {IsBoolean, IsOptional} from 'class-validator';
import {PersonPreferences} from '@melluin/common';

export class PersonPreferencesValidatedInput implements PersonPreferences {

    @IsBoolean()
    @IsOptional()
    canVolunteerSeeMyPhone?: boolean;

    @IsBoolean()
    @IsOptional()
    canVolunteerSeeMyEmail?: boolean;

}
