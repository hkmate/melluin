import {EnumTypeOf} from '@melluin/common';

export const ListPageSettingChangeReasons = {
    ALL: 'ALL',
    PREFERENCES: 'PREFERENCES',
    PAGE_DATA: 'PAGE_DATA',
    FILTERS: 'FILTERS'
} as const;
export type ListPageSettingChangeReason = EnumTypeOf<typeof ListPageSettingChangeReasons>;

export const reasonIsNotPageData = (reason: ListPageSettingChangeReason): boolean => reason !== ListPageSettingChangeReasons.PAGE_DATA;
export const reasonIsNotPreferences = (reason: ListPageSettingChangeReason): boolean => reason !== ListPageSettingChangeReasons.PREFERENCES;
export const reasonIsPreferences = (reason: ListPageSettingChangeReason): boolean => reason === ListPageSettingChangeReasons.PREFERENCES;
