import {IsBoolean, IsOptional} from 'class-validator';
import {PersonPreferences} from '@melluin/common';
import {ApiProperty} from '@nestjs/swagger';

export class PersonPreferencesDto implements PersonPreferences {

    @ApiProperty({required: false})
    @IsBoolean()
    @IsOptional()
    canVolunteerSeeMyPhone?: boolean;

    @ApiProperty({required: false})
    @IsBoolean()
    @IsOptional()
    canVolunteerSeeMyEmail?: boolean;

}
