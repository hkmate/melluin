import {PersonEntity} from '@be/person/model/person.entity';
import {PersonRewrite, Validator} from '@melluin/common';

export interface PersonRewriteWithEntity {
    person: PersonEntity,
    rewrite: PersonRewrite
}

export type PersonRewriteValidator = Validator<PersonRewriteWithEntity>;
