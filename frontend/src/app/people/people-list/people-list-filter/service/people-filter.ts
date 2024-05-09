import {Role} from '@shared/user/role.enum';

export class PeopleFilter {

    public name: string;
    public email: string;
    public phone: string;
    public onlyActive: boolean;
    public role: Array<Role>;

}
