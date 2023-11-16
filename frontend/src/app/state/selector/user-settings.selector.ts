import {createFeatureSelector, select} from '@ngrx/store';
import {filter, map, pipe} from 'rxjs';
import {isNotNil} from '@shared/util/util';
import {userSettingsKey} from '@fe/app/state/app.state';

import {UserSettings} from '@shared/user/user-settings';


export const selectNilableUserSettingsFeature = createFeatureSelector<UserSettings>(userSettingsKey);

export const selectUserSettings = pipe(
    select(selectNilableUserSettingsFeature),
    filter(val => isNotNil(val))
);

export const selectUserHomePageSettings = pipe(
    selectUserSettings,
    map(val => val.homePage)
);

export const selectUserWidgetsSettings = pipe(
    selectUserSettings,
    map(val => val.dashboard?.widgets)
);
