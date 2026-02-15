import {createFeatureSelector, select} from '@ngrx/store';
import {filter, pipe} from 'rxjs';
import {isNotNilOrEmptyObj, User} from '@melluin/common';
import {currentUserKey} from '@fe/app/state/app.state';


export const selectNilableCurrentUserFeature = createFeatureSelector<User>(currentUserKey);

export const selectCurrentUser = pipe(
    select(selectNilableCurrentUserFeature),
    filter(val => isNotNilOrEmptyObj(val))
);
