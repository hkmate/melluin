import {AsyncValidator, UserRewrite} from '@melluin/common';
import {UserEntity} from '@be/user/model/user.entity';


export interface UserRewriteWithEntity {
    entity: UserEntity,
    rewrite: UserRewrite
}

export type UserRewriteValidator = AsyncValidator<UserRewriteWithEntity>;
