import {PersonEntity} from '@be/person/model/person.entity';
import {PersonRewrite} from '@shared/person/person-rewrite';
import {Validator} from '@shared/validator/validator';

export interface PersonRewriteWithEntity {
    person: PersonEntity,
    rewrite: PersonRewrite
}

export type PersonRewriteValidator = Validator<PersonRewriteWithEntity>;
