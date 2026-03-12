import {IsEmail, IsEnum, IsOptional, IsPhoneNumber, MinLength, ValidateNested} from 'class-validator';
import {nameMinLength, OperationCities, OperationCity, PersonCreation, PersonPreferences} from '@melluin/common';
import {Type} from 'class-transformer';
import {PersonPreferencesDto} from '@be/person/api/dto/person-preferences.dto';
import {ApiProperty} from '@nestjs/swagger';

export class PersonCreationDto implements PersonCreation {

    @ApiProperty()
    @MinLength(nameMinLength)
    firstName: string;

    @ApiProperty()
    @MinLength(nameMinLength)
    lastName: string;

    @ApiProperty({type: () => PersonPreferencesDto, required: false})
    @ValidateNested()
    @Type(() => PersonPreferencesDto)
    @IsOptional()
    preferences?: PersonPreferences;

    @ApiProperty({required: false})
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({required: false})
    @IsPhoneNumber()
    @IsOptional()
    phone?: string;

    @ApiProperty({enum: OperationCities, enumName: 'OperationCity'})
    @IsEnum(OperationCities, {each: true})
    cities: Array<OperationCity>;

}
