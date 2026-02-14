import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {BoxStatusChangeReason} from '@shared/department/box/box-status-change-reason';
import {DateIntervalSpecifier} from '@shared/util/date-interval-generator';

export const EventsDateFilterValues = [
    DateIntervalSpecifier.WEEK,
    DateIntervalSpecifier.TWO_WEEK,
    DateIntervalSpecifier.THREE_WEEK,
    DateIntervalSpecifier.MONTH
];

export interface EventListUserSettings {

    dateFilter?: DateIntervalSpecifier;
    departmentIds?: Array<string>;
    statuses?: Array<HospitalVisitStatus>;
    participantIds?: Array<string>;
    needHighlight?: boolean;

}

export enum HomePageOption {
    DASHBOARD = 'DASHBOARD',
    EVENT_LIST = 'EVENT_LIST',
    ACTUAL_HOSPITAL_VISIT_DETAILS = 'ACTUAL_HOSPITAL_VISIT_DETAILS',
    ACTUAL_HOSPITAL_VISIT_FILLER = 'ACTUAL_HOSPITAL_VISIT_FILLER',
}

export interface HomePageUserSettings {

    inMobile?: HomePageOption;
    inDesktop?: HomePageOption;

}

export enum WidgetType {
    DEPARTMENT_BOX = 'DEPARTMENT_BOX',
}

export interface WidgetSetting {

    needed: boolean;
    index: number;
    type: WidgetType;

}

export const DepartmentBoxInfoSinceDateValues = [
    DateIntervalSpecifier.LAST_WEEK,
    DateIntervalSpecifier.LAST_TWO_WEEK,
    DateIntervalSpecifier.LAST_MONTH
];

export interface DepartmentBoxWidgetSettings extends WidgetSetting {

    type: WidgetType.DEPARTMENT_BOX;
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
