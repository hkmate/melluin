import {UserEntity} from '@be/user/model/user.entity';
import {User} from '@shared/user/user';
import {Injectable} from '@nestjs/common';
import {flatten, isNil} from '@shared/util/util';
import {Converter} from '@shared/converter';
import * as _ from 'lodash';

@Injectable()
export class UserEntityToDtoConverter implements Converter<UserEntity, User> {

    public convert(entity: UserEntity): User;
    public convert(entity: undefined): undefined;
    public convert(entity?: UserEntity): User | undefined;
    public convert(entity?: UserEntity): User | undefined {
        if (isNil(entity)) {
            return undefined;
        }
        return this.convertNotNilEntity(entity);
    }

    private convertNotNilEntity(entity: UserEntity): User {
        return {
            id: entity.id,
            personId: entity.person.id,
            userName: entity.userName,
            isActive: entity.isActive,
            roles: entity.roles?.map(roleEntity => roleEntity.role),
            permissions: _.union(flatten(
                entity.roles.map(role => role.permissions))
                .map(permission => permission.permission)),
            customPermissions: entity.customPermissions.map(permission => permission.permission)
        };
    }

}
