import {VisitStatus} from '../visit/visit-status';
import {BoxStatusChangeReason} from '../department/box/box-status-change-reason';
import {DateIntervalSpecifier, DateIntervalSpecifiers} from '../util/date-interval-generator';
import {UUID} from '../util/type/uuid.type';
import {EnumTypeOf} from '../util/type/enum.type';

export const EventsDateFilterValues = [
    DateIntervalSpecifiers.WEEK,
    DateIntervalSpecifiers.TWO_WEEK,
    DateIntervalSpecifiers.THREE_WEEK,
    DateIntervalSpecifiers.MONTH
];

export interface EventListUserSettings {

    dateFilter?: DateIntervalSpecifier;
    departmentIds?: Array<UUID>;
    statuses?: Array<VisitStatus>;
    participantIds?: Array<UUID>;
    needHighlight?: boolean;

}

export const HomePageOptions = {
    DASHBOARD: 'DASHBOARD',
    EVENT_LIST: 'EVENT_LIST',
    ACTUAL_HOSPITAL_VISIT_DETAILS: 'ACTUAL_HOSPITAL_VISIT_DETAILS',
    ACTUAL_HOSPITAL_VISIT_FILLER: 'ACTUAL_HOSPITAL_VISIT_FILLER',
} as const;
export type HomePageOption = EnumTypeOf<typeof HomePageOptions>;

export interface HomePageUserSettings {

    inMobile?: HomePageOption;
    inDesktop?: HomePageOption;

}

export const WidgetTypes = {
    DEPARTMENT_BOX: 'DEPARTMENT_BOX',
} as const
export type WidgetType = EnumTypeOf<typeof WidgetTypes>;

export interface WidgetSetting {

    needed: boolean;
    index: number;
    type: WidgetType;

}

export const DepartmentBoxInfoSinceDateValues = [
    DateIntervalSpecifiers.LAST_WEEK,
    DateIntervalSpecifiers.LAST_TWO_WEEK,
    DateIntervalSpecifiers.LAST_MONTH
];

export interface DepartmentBoxWidgetSettings extends WidgetSetting {

    type: typeof WidgetTypes.DEPARTMENT_BOX;
    dateInterval?: DateIntervalSpecifier;
    reasons?: Array<BoxStatusChangeReason>;
    limit?: number;

}

export interface DashboardWidgetSettings {

    departmentBox?: DepartmentBoxWidgetSettings;

}

export interface DashboardUserSettings {

    widgets?: DashboardWidgetSettings;

}

export interface UserSettings {

    eventList?: EventListUserSettings;
    homePage?: HomePageUserSettings;
    dashboard?: DashboardUserSettings;

}
