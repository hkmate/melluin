import {UserRewrite} from '@shared/user/user-rewrite';
import {UserEntity} from '@be/user/model/user.entity';
import {Applier} from '@shared/applier';
import {UserDao} from '@be/user/user.dao';
import {RoleEntity} from '@be/user/model/role.entity';
import {Role} from '@shared/user/role.enum';
import * as _ from 'lodash';


export class UserRoleRewriteApplier implements Applier<UserEntity> {

    constructor(private readonly userDao: UserDao,
                private readonly rewrite: UserRewrite) {
    }

    public async applyOn(persisted: UserEntity): Promise<void> {
        if (!this.hasChanged(persisted.roles, this.rewrite.roles)) {
            return;
        }
        persisted.roles = await this.getEntitiesFromRoles(this.rewrite.roles);
    }

    private hasChanged(persisted: Array<RoleEntity>, needed: Array<Role>): boolean {
        return _.isEqual(
            persisted.map(value => value.role),
            needed
        );
    }

    private async getEntitiesFromRoles(roles: Array<Role>): Promise<Array<RoleEntity>> {
        const availableRoleEntities = await this.userDao.findAllRole();
        return availableRoleEntities.filter(e => roles.includes(e.role));
    }

}
