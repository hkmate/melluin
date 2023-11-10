import {Injectable} from '@nestjs/common';
import {isNil} from '@shared/util/util';
import {Converter} from '@shared/converter';
import {RoleEntity} from '@be/user/model/role.entity';
import {RolePermission} from '@shared/user/role.enum';

@Injectable()
export class RoleEntityToDtoConverter implements Converter<RoleEntity, RolePermission> {

    public convert(entity: RoleEntity): RolePermission;
    public convert(entity: undefined): undefined;
    public convert(entity?: RoleEntity): RolePermission | undefined;
    public convert(entity?: RoleEntity): RolePermission | undefined {
        if (isNil(entity)) {
            return undefined;
        }
        return this.convertNotNilEntity(entity);
    }

    private convertNotNilEntity(entity: RoleEntity): RolePermission {
        return {
            id: entity.id,
            role: entity.role,
            permissions: entity.permissions.map(permission => permission.permission)
        }
    }

}
