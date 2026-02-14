import {User} from './user';
import {UserSettings} from '@shared/user/user-settings';

export interface AuthInfo {
    accessToken: string;
    user: User;
    userSettings: UserSettings;
}
