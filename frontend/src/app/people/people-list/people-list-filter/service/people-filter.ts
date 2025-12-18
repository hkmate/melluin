import {OperationCity} from '@shared/person/operation-city';

export class PeopleFilter {

    public name: string;
    public email: string;
    public phone: string;
    public onlyActive: boolean;
    public roleNames: Array<string>;
    public cities: Array<OperationCity>;

}
