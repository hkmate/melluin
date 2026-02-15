import {createReducer, on} from '@ngrx/store';
import {AppActions} from '@fe/app/state/app-actions';
import {cast, User} from '@melluin/common';

export const currentUserReducer = createReducer(
    cast<User>(undefined),
    on(AppActions.currentUserLoaded, (state: User, action): User => action.user),
    on(AppActions.userLogout, (state: User): User => cast<User>({}))
);
