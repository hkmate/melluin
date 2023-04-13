import {Injectable} from '@nestjs/common';
import {UserRewrite} from '@shared/user/user-rewrite';
import {UserEntity} from '@be/user/model/user.entity';
import {UserPrimitivesRewriteApplier} from '@be/user/applier/user-primitives-rewrite.applier';
import {AsyncApplier, AsyncApplierChain} from '@shared/applier';
import {UserPasswordRewriteApplier} from '@be/user/applier/user-password-rewrite.applier';
import {PasswordCryptService} from '@be/user/service/password-crypt.service';
import {UserRoleRewriteApplier} from '@be/user/applier/user-role-rewrite.applier';
import {UserDao} from '@be/user/user.dao';

@Injectable()
export class UserRewriteApplierFactory {

    constructor(private readonly encoder: PasswordCryptService,
                private readonly userDao: UserDao) {
    }

    public createFor(rewrite: UserRewrite): AsyncApplier<UserEntity> {
        return AsyncApplierChain.of(
            new UserPrimitivesRewriteApplier(rewrite),
            new UserPasswordRewriteApplier(this.encoder, rewrite),
            new UserRoleRewriteApplier(this.userDao, rewrite)
        );
    }

}