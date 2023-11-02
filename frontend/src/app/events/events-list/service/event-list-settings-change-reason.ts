
export enum EventListSettingChangeReason {
    ALL = 'ALL',
    PREFERENCES = 'PREFERENCES',
    PAGE_DATA = 'PAGE_DATA',
    FILTERS = 'FILTERS'
}

export const reasonIsNotPageData = (reason: EventListSettingChangeReason): boolean => reason !== EventListSettingChangeReason.PAGE_DATA;
export const reasonIsNotPreferences = (reason: EventListSettingChangeReason): boolean => reason !== EventListSettingChangeReason.PREFERENCES;
export const reasonIsPreferences = (reason: EventListSettingChangeReason): boolean => reason === EventListSettingChangeReason.PREFERENCES;
