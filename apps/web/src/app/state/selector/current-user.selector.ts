import {createFeatureSelector, select} from '@ngrx/store';
import {filter, pipe} from 'rxjs';
import {isNotNilOrEmptyObj} from '@shared/util/util';
import {currentUserKey} from '@fe/app/state/app.state';
import {User} from '@shared/user/user';


export const selectNilableCurrentUserFeature = createFeatureSelector<User>(currentUserKey);

export const selectCurrentUser = pipe(
    select(selectNilableCurrentUserFeature),
    filter(val => isNotNilOrEmptyObj(val))
);
