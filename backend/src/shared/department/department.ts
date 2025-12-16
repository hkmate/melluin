import {DepartmentCity} from '@shared/department/department-city';

export interface Department {

    id: string;
    name: string;
    validFrom: string;
    validTo?: string;
    address: string;
    city: DepartmentCity;
    diseasesInfo?: string;
    note?: string;

}
