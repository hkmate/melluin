import {IsBoolean, IsEnum, IsOptional, IsPositive, IsUUID, ValidateNested} from 'class-validator';
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
    statuses?: Array<HospitalVisitStatus>;

    @IsOptional()
    @IsUUID('all', {each: true})
    participantIds?: Array<string>;

    @IsOptional()
    @IsBoolean()
    needHighlight?: boolean;

}

export enum HomePageOption {
    DASHBOARD = 'DASHBOARD',
    EVENT_LIST = 'EVENT_LIST',
    ACTUAL_HOSPITAL_VISIT_DETAILS = 'ACTUAL_HOSPITAL_VISIT_DETAILS',
    ACTUAL_HOSPITAL_VISIT_FILLER = 'ACTUAL_HOSPITAL_VISIT_FILLER',
}

export class HomePageUserSettings {

    @IsOptional()
    @IsEnum(HomePageOption)
    inMobile?: HomePageOption;

    @IsOptional()
    @IsEnum(HomePageOption)
    inDesktop?: HomePageOption;

}

export class WidgetSetting {

    @IsOptional()
    @IsBoolean()
    needed?: boolean;

    @IsOptional()
    @IsPositive()
    index?: number;

}

export class DashboardUserSettings {

    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => WidgetSetting)
    widgets?: Array<WidgetSetting>;

}

export class UserSettings {

    @IsOptional()
    @ValidateNested()
    @Type(() => EventListUserSettings)
    eventList?: EventListUserSettings;

    @IsOptional()
    @ValidateNested()
    @Type(() => HomePageUserSettings)
    homePage?: HomePageUserSettings;

    @IsOptional()
    @ValidateNested()
    @Type(() => DashboardUserSettings)
    dashboard?: DashboardUserSettings;

}
