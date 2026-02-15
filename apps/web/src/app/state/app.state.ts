import {User, UserSettings} from '@melluin/common';


export const currentUserKey = 'currentUser'
export const userSettingsKey = 'userSettings'

export interface CurrentUserState {
    [currentUserKey]: User;
}

export interface UserSettingsState {
    [userSettingsKey]: UserSettings;
}

export type AppState = CurrentUserState & UserSettingsState;
