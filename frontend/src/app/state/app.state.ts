import {User} from '@shared/user/user';


export const currentUserKey = 'currentUser'

export interface CurrentUserState {
    [currentUserKey]: User;
}

export type AppState = CurrentUserState;
