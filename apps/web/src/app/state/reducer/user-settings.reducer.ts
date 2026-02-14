import {createReducer, on} from '@ngrx/store';
import {AppActions} from '@fe/app/state/app-actions';
import {cast} from '@shared/util/test-util';
import {UserSettings} from '@shared/user/user-settings';

export const userSettingsReducer = createReducer(
    cast<UserSettings>(undefined),
    on(AppActions.userSettingsLoaded, (state: UserSettings, action): UserSettings => action.userSettings),
    on(AppActions.userLogout, (state: UserSettings): UserSettings => cast<UserSettings>({}))
);
