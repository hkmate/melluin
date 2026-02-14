import {UserRewrite} from '@shared/user/user-rewrite';
import {UserEntity} from '@be/user/model/user.entity';
import {Applier} from '@shared/applier';
import {RoleEntity} from '@be/user/model/role.entity';
import * as _ from 'lodash';
import {RoleDao} from '@be/user/role.dao';


export class UserRoleRewriteApplier implements Applier<UserEntity> {

    constructor(private readonly roleDao: RoleDao,
                private readonly rewrite: UserRewrite) {
    }

    public async applyOn(persisted: UserEntity): Promise<void> {
        if (!this.hasChanged(persisted.roles, this.rewrite.roleNames)) {
            return;
        }
        persisted.roles = await this.getEntitiesFromNames(this.rewrite.roleNames);
    }

    private hasChanged(persisted: Array<RoleEntity>, neededRoleNames: Array<string>): boolean {
        return !_.isEqual(
            persisted.map(value => value.name),
            neededRoleNames
        );
    }

    private getEntitiesFromNames(roleNames: Array<string>): Promise<Array<RoleEntity>> {
        return this.roleDao.findAllByName(roleNames);
    }

}
