import {IsBoolean, IsEnum, IsIn, IsOptional, IsPositive, IsUUID, ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {BoxStatusChangeReason} from '@shared/department/box/box-status-change-reason';
import {DateIntervalSpecifier} from '@shared/util/date-interval-generator';

export const EventsDateFilterValues = [
    DateIntervalSpecifier.WEEK,
    DateIntervalSpecifier.TWO_WEEK,
    DateIntervalSpecifier.THREE_WEEK,
    DateIntervalSpecifier.MONTH
];

export class EventListUserSettings {

    @IsOptional()
    @IsIn(EventsDateFilterValues)
    dateFilter?: DateIntervalSpecifier;

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

export enum WidgetType {
    DEPARTMENT_BOX = 'DEPARTMENT_BOX',
}

export class WidgetSetting {

    @IsOptional()
    @IsBoolean()
    needed: boolean;

    @IsOptional()
    @IsPositive()
    index: number;

    @IsOptional()
    @IsEnum(WidgetType)
    type: WidgetType;

}

export const DepartmentBoxInfoSinceDateValues = [
    DateIntervalSpecifier.LAST_WEEK,
    DateIntervalSpecifier.LAST_TWO_WEEK,
    DateIntervalSpecifier.LAST_MONTH
];

export class DepartmentBoxWidgetSettings extends WidgetSetting {

    override readonly type = WidgetType.DEPARTMENT_BOX;

    @IsOptional()
    @IsIn(DepartmentBoxInfoSinceDateValues)
    dateInterval?: DateIntervalSpecifier;

    @IsOptional()
    @IsEnum(BoxStatusChangeReason, {each: true})
    reasons?: Array<BoxStatusChangeReason>;

    @IsOptional()
    @IsPositive()
    limit?: number;

}

export class DashboardWidgetSettings {

    @IsOptional()
    @ValidateNested()
    @Type(() => DepartmentBoxWidgetSettings)
    departmentBox?: DepartmentBoxWidgetSettings;

}

export class DashboardUserSettings {

    @IsOptional()
    @ValidateNested()
    @Type(() => DashboardWidgetSettings)
    widgets?: DashboardWidgetSettings;

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
