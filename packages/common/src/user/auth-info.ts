import {User} from './user';
import {UserSettings} from './user-settings';

export interface AuthInfo {
    accessToken: string;
    user: User;
    userSettings: UserSettings;
}
