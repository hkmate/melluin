import {AsyncValidator} from '@shared/validator/validator';
import {UserEntity} from '@be/user/model/user.entity';
import {UserRewrite} from '@shared/user/user-rewrite';


export interface UserRewriteWithEntity {
    entity: UserEntity,
    rewrite: UserRewrite
}

export type UserRewriteValidator = AsyncValidator<UserRewriteWithEntity>;
