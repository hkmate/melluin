import {IsBoolean, IsEnum, IsOptional, IsUUID, ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';


export enum EventsDateFilter {
    WEEK = 'WEEK',
    TWO_WEEK = 'TWO_WEEK',
    THREE_WEEK = 'THREE_WEEK',
    MONTH = 'MONTH'
}

export class EventListUserSettings {

    @IsOptional()
    @IsEnum(EventsDateFilter)
    dateFilter?: EventsDateFilter;

    @IsOptional()
    @IsUUID('all', {each: true})
    departmentIds?: Array<string>;

    @IsOptional()
    @IsEnum(HospitalVisitStatus, {each: true})
    statuses?: Array<string>;

    @IsOptional()
    @IsUUID('all', {each: true})
    participantIds?: Array<string>;

    @IsOptional()
    @IsBoolean()
    needHighlight?: boolean;

}

export class UserSettings {

    @IsOptional()
    @ValidateNested()
    @Type(() => EventListUserSettings)
    eventList?: EventListUserSettings;

}
