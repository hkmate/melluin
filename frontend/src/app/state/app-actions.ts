import {createAction, props} from '@ngrx/store';
import {User} from '@shared/user/user';


export class AppActions {

    public static readonly appStarts = createAction('[App] Starts');
    public static readonly userLogout = createAction('[App] Logout');
    public static readonly currentUserLoaded = createAction('[App] Current user loaded', props<{ user: User }>());

}
