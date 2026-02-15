import {createReducer, on} from '@ngrx/store';
import {AppActions} from '@fe/app/state/app-actions';
import {cast, UserSettings} from '@melluin/common';

export const userSettingsReducer = createReducer(
    cast<UserSettings>(undefined),
    on(AppActions.userSettingsLoaded, (state: UserSettings, action): UserSettings => action.userSettings),
    on(AppActions.userLogout, (state: UserSettings): UserSettings => cast<UserSettings>({}))
);
