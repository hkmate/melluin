
export enum ListPageSettingChangeReason {
    ALL = 'ALL',
    PREFERENCES = 'PREFERENCES',
    PAGE_DATA = 'PAGE_DATA',
    FILTERS = 'FILTERS'
}

export const reasonIsNotPageData = (reason: ListPageSettingChangeReason): boolean => reason !== ListPageSettingChangeReason.PAGE_DATA;
export const reasonIsNotPreferences = (reason: ListPageSettingChangeReason): boolean => reason !== ListPageSettingChangeReason.PREFERENCES;
export const reasonIsPreferences = (reason: ListPageSettingChangeReason): boolean => reason === ListPageSettingChangeReason.PREFERENCES;
