import {AsyncValidator, Department, DepartmentCreation, User} from '@melluin/common';
import {DepartmentEntity} from '@be/department/model/department.entity';

export interface DepartmentRewriteValidationData {
    entity: DepartmentEntity,
    item: Department,
    requester: User,
}

export interface DepartmentCreateValidationData {
    item: DepartmentCreation,
    requester: User,
}

export type DepartmentValidationData = DepartmentRewriteValidationData | DepartmentCreateValidationData;

export type DepartmentRewriteValidator = AsyncValidator<DepartmentRewriteValidationData>;
export type DepartmentCreateValidator = AsyncValidator<DepartmentCreateValidationData>;
export type DepartmentSaveValidator = AsyncValidator<DepartmentValidationData>;
