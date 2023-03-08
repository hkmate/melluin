import {BriefUser} from '@shared/user/user';


export interface PersonIdentifier {
    id: string;
    firstName: string;
    lastName: string;
    nickName?: string;
}

export interface Person extends PersonIdentifier {
    email?: string;
    phone?: string;
    user?: BriefUser;
}
