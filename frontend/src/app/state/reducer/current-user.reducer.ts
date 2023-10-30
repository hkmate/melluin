import {createReducer, on} from '@ngrx/store';
import {AppActions} from '@fe/app/state/app-actions';
import {User} from '@shared/user/user';
import {cast} from '@shared/util/test-util';

export const currentUserReducer = createReducer(
    cast<User>(undefined),
    on(AppActions.currentUserLoaded, (state: User, action): User => action.user),
    on(AppActions.userLogout, (state: User): User => cast<User>({}))
);
