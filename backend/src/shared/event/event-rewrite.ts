import {EventVisibility} from '@shared/event/event-visibility';
import {IsArray, IsDateString, IsEnum, IsNumber, IsOptional, IsUUID, Min} from 'class-validator';

export class EventRewrite {

    @IsDateString()
    dateTimeFrom: string;

    @IsDateString()
    dateTimeTo: string;

    @IsNumber({maxDecimalPlaces: 2})
    @Min(0)
    @IsOptional()
    countedMinutes?: number;

    @IsEnum(EventVisibility)
    visibility: EventVisibility;

    @IsUUID('all', {each: true})
    @IsArray()
    participantIds: Array<string>;

}
