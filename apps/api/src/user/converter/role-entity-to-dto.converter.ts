import {Injectable} from '@nestjs/common';
import {Converter, isNil, Role} from '@melluin/common';
import {RoleEntity} from '@be/user/model/role.entity';

@Injectable()
export class RoleEntityToDtoConverter implements Converter<RoleEntity, Role> {

    public convert(entity: RoleEntity): Role;
    public convert(entity: undefined): undefined;
    public convert(entity?: RoleEntity): Role | undefined;
    public convert(entity?: RoleEntity): Role | undefined {
        if (isNil(entity)) {
            return undefined;
        }
        return this.convertNotNilEntity(entity);
    }

    private convertNotNilEntity(entity: RoleEntity): Role {
        return {
            id: entity.id,
            name: entity.name,
            type: entity.type,
            permissions: entity.permissions.map(permission => permission.permission)
        }
    }

}
