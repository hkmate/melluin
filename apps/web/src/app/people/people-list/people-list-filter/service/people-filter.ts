import {OperationCity} from '@melluin/common';

export interface PeopleFilter {

    name: string;
    email: string;
    phone: string;
    onlyActive: boolean;
    roleNames: Array<string>;
    cities: Array<OperationCity>;

}
