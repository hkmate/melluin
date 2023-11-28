import {Role} from '@shared/user/role.enum';

export class PeopleFilter {

    public name: string;
    public email: string;
    public phone: string;
    public isActive: boolean;
    public role: Array<Role>;

}
