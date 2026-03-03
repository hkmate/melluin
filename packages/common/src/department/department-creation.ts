import {Department} from './department';

export type DepartmentCreation = Omit<Department, 'id'>;
