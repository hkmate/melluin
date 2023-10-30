import {createReducer, on} from '@ngrx/store';
import {AppActions} from '@fe/app/state/app-actions';
import {UserSettings} from '@shared/user/user';
import {cast} from '@shared/util/test-util';

export const userSettingsReducer = createReducer(
    cast<UserSettings>(undefined),
    on(AppActions.userSettingsLoaded, (state: UserSettings, action): UserSettings => action.userSettings),
    on(AppActions.userLogout, (state: UserSettings): UserSettings => cast<UserSettings>({}))
);
