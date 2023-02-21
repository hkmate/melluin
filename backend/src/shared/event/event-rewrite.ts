import {EventVisibility} from '@shared/event/event-visibility';
import {IsArray, IsDateString, IsEnum, IsNumber, IsOptional, IsUUID, Min} from 'class-validator';

export class EventRewrite {

    @IsDateString()
    dateTimeFrom: string;

    @IsDateString()
    dateTimeTo: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    countedHours?: number;

    @IsEnum(EventVisibility)
    visibility: EventVisibility;

    @IsUUID('all', {each: true})
    @IsArray()
    participantIds: Array<string>;

}
