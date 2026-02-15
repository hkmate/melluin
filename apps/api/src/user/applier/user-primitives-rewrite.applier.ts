import {AsyncApplier, UserRewrite} from '@melluin/common';
import {UserEntity} from '@be/user/model/user.entity';


export class UserPrimitivesRewriteApplier implements AsyncApplier<UserEntity> {

    constructor(private readonly rewrite: UserRewrite) {
    }

    public applyOn(persisted: UserEntity): Promise<void> {
        this.rewirePrimitiveFields(persisted);
        return Promise.resolve();
    }

    private rewirePrimitiveFields(persisted: UserEntity): void {
        persisted.isActive = this.rewrite.isActive;
        persisted.userName = this.rewrite.userName;
    }

}
