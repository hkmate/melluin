import {User} from '@shared/user/user';

export interface Person {
    id: string;
    firstName: string;
    lastName: string;
    nickName?: string;
    email?: string;
    phone?: string;
    user?: User;
}
