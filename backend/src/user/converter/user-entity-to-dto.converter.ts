import {UserEntity} from '@be/user/model/user.entity';
import {User} from '@shared/user/user';
import {Injectable} from '@nestjs/common';
import {flatten, isNil} from '@shared/util/util';
import {Converter} from '@shared/converter';
import * as _ from 'lodash';
import {PermissionEntity} from '@be/user/model/permission.entity';
import {RoleEntityToBriefDtoConverter} from '@be/user/converter/role-entity-to-brief-dto.converter';

@Injectable()
export class UserEntityToDtoConverter implements Converter<UserEntity, User> {

    constructor(private roleConverter: RoleEntityToBriefDtoConverter) {
    }

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
        const customPermissions = entity.customPermissions.map(PermissionEntity.raw);
        return {
            id: entity.id,
            personId: entity.person.id,
            userName: entity.userName,
            isActive: entity.isActive,
            roles: entity.roles?.map(roleEntity => this.roleConverter.convert(roleEntity)),
            permissions: _.union(
                flatten(entity.roles.map(role => role.permissions)).map(PermissionEntity.raw),
                customPermissions),
            customPermissions,
        };
    }

}
