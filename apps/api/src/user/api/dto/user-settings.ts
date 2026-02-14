import {IsBoolean, IsEnum, IsIn, IsOptional, IsPositive, IsUUID, ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {BoxStatusChangeReason} from '@shared/department/box/box-status-change-reason';
import {DateIntervalSpecifier} from '@shared/util/date-interval-generator';
import {
    DashboardUserSettings,
    DashboardWidgetSettings,
    DepartmentBoxInfoSinceDateValues,
    DepartmentBoxWidgetSettings,
    EventListUserSettings,
    EventsDateFilterValues,
    HomePageOption,
    HomePageUserSettings,
    UserSettings,
    WidgetSetting,
    WidgetType
} from '@shared/user/user-settings';

export class EventListUserSettingsValidatedInput implements EventListUserSettings {

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

export class HomePageUserSettingsValidatedInput implements HomePageUserSettings {

    @IsOptional()
    @IsEnum(HomePageOption)
    inMobile?: HomePageOption;

    @IsOptional()
    @IsEnum(HomePageOption)
    inDesktop?: HomePageOption;

}

export class WidgetSettingValidatedInput implements WidgetSetting {

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

export class DepartmentBoxWidgetSettingsValidatedInput
    extends WidgetSettingValidatedInput
    implements DepartmentBoxWidgetSettings {

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

export class DashboardWidgetSettingsValidatedInput implements DashboardWidgetSettings {

    @IsOptional()
    @ValidateNested()
    @Type(() => DepartmentBoxWidgetSettingsValidatedInput)
    departmentBox?: DepartmentBoxWidgetSettings;

}

export class DashboardUserSettingsValidatedInput implements DashboardUserSettings {

    @IsOptional()
    @ValidateNested()
    @Type(() => DashboardWidgetSettingsValidatedInput)
    widgets?: DashboardWidgetSettings;

}

export class UserSettingsValidatedInput implements UserSettings {

    @IsOptional()
    @ValidateNested()
    @Type(() => EventListUserSettingsValidatedInput)
    eventList?: EventListUserSettings;

    @IsOptional()
    @ValidateNested()
    @Type(() => HomePageUserSettingsValidatedInput)
    homePage?: HomePageUserSettings;

    @IsOptional()
    @ValidateNested()
    @Type(() => DashboardUserSettingsValidatedInput)
    dashboard?: DashboardUserSettings;

}
