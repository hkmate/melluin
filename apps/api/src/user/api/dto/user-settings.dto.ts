import {IsBoolean, IsEnum, IsIn, IsOptional, IsPositive, IsUUID, Min, ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';
import {
    BoxStatusChangeReason,
    DashboardUserSettings,
    DashboardWidgetSettings,
    DateIntervalSpecifier,
    DepartmentBoxInfoSinceDateValues,
    DepartmentBoxWidgetSettings,
    EventListUserSettings,
    EventsDateFilterValues,
    HomePageOption,
    HomePageUserSettings,
    UserSettings, UUID,
    VisitStatus,
    WidgetSetting,
    WidgetType
} from '@melluin/common';
import {ApiProperty} from '@nestjs/swagger';

export class EventListUserSettingsDto implements EventListUserSettings {

    @ApiProperty({enum: EventsDateFilterValues, required: false})
    @IsOptional()
    @IsIn(EventsDateFilterValues)
    dateFilter?: DateIntervalSpecifier;

    @ApiProperty({type: [String], required: false})
    @IsOptional()
    @IsUUID('all', {each: true})
    departmentIds?: Array<UUID>;

    @ApiProperty({enum: VisitStatus, isArray: true, required: false})
    @IsOptional()
    @IsEnum(VisitStatus, {each: true})
    statuses?: Array<VisitStatus>;

    @ApiProperty({type: [String], required: false})
    @IsOptional()
    @IsUUID('all', {each: true})
    participantIds?: Array<UUID>;

    @ApiProperty({required: false})
    @IsOptional()
    @IsBoolean()
    needHighlight?: boolean;

}

export class HomePageUserSettingsDto implements HomePageUserSettings {

    @ApiProperty({enum: HomePageOption, required: false})
    @IsOptional()
    @IsEnum(HomePageOption)
    inMobile?: HomePageOption;

    @ApiProperty({enum: HomePageOption, required: false})
    @IsOptional()
    @IsEnum(HomePageOption)
    inDesktop?: HomePageOption;

}

export class WidgetSettingDto implements WidgetSetting {

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    needed: boolean;

    @ApiProperty()
    @IsOptional()
    @Min(0)
    index: number;

    @ApiProperty({enum: WidgetType})
    @IsOptional()
    @IsEnum(WidgetType)
    type: WidgetType;

}

export class DepartmentBoxWidgetSettingsDto
    extends WidgetSettingDto
    implements DepartmentBoxWidgetSettings {

    override readonly type = WidgetType.DEPARTMENT_BOX;

    @ApiProperty({enum: DepartmentBoxInfoSinceDateValues, required: false})
    @IsOptional()
    @IsIn(DepartmentBoxInfoSinceDateValues)
    dateInterval?: DateIntervalSpecifier;

    @ApiProperty({enum: BoxStatusChangeReason, isArray: true, required: false})
    @IsOptional()
    @IsEnum(BoxStatusChangeReason, {each: true})
    reasons?: Array<BoxStatusChangeReason>;

    @ApiProperty({required: false})
    @IsOptional()
    @IsPositive()
    limit?: number;

}

export class DashboardWidgetSettingsDto implements DashboardWidgetSettings {

    @ApiProperty({type: () => DepartmentBoxWidgetSettingsDto, required: false})
    @IsOptional()
    @ValidateNested()
    @Type(() => DepartmentBoxWidgetSettingsDto)
    departmentBox?: DepartmentBoxWidgetSettings;

}

export class DashboardUserSettingsDto implements DashboardUserSettings {

    @ApiProperty({type: () => DashboardWidgetSettingsDto, required: false})
    @IsOptional()
    @ValidateNested()
    @Type(() => DashboardWidgetSettingsDto)
    widgets?: DashboardWidgetSettings;

}

export class UserSettingsDto implements UserSettings {

    @ApiProperty({type: () => EventListUserSettingsDto, required: false})
    @IsOptional()
    @ValidateNested()
    @Type(() => EventListUserSettingsDto)
    eventList?: EventListUserSettings;

    @ApiProperty({type: () => HomePageUserSettingsDto, required: false})
    @IsOptional()
    @ValidateNested()
    @Type(() => HomePageUserSettingsDto)
    homePage?: HomePageUserSettings;

    @ApiProperty({type: () => DashboardUserSettingsDto, required: false})
    @IsOptional()
    @ValidateNested()
    @Type(() => DashboardUserSettingsDto)
    dashboard?: DashboardUserSettings;

}
