import {AsyncApplier, isNil, UserRewrite} from '@melluin/common';
import {UserEntity} from '@be/user/model/user.entity';
import {PasswordCryptService} from '@be/user/service/password-crypt.service';


export class UserPasswordRewriteApplier implements AsyncApplier<UserEntity> {

    constructor(private readonly encoder: PasswordCryptService,
                private readonly rewrite: UserRewrite) {
    }

    public applyOn(persisted: UserEntity): Promise<void> {
        if (isNil(this.rewrite.password)) {
            return Promise.resolve();
        }

        persisted.password = this.encoder.encrypt(this.rewrite.password);
        return Promise.resolve();
    }

}
