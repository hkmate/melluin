import {isNil} from '@shared/util/util';
import {Converter} from '@shared/converter';
import {randomUUID} from 'crypto';
import {Injectable} from '@nestjs/common';
import {PermissionDao} from '@be/user/permission.dao';
import {RoleCreation} from '@shared/user/role';
import {RoleEntity} from '@be/user/model/role.entity';

@Injectable()
export class RoleCreationToEntityConverter implements Converter<RoleCreation, Promise<RoleEntity>> {

    constructor(private readonly permissionDao: PermissionDao) {
    }

    public convert(value: RoleCreation): Promise<RoleEntity>;
    public convert(value: undefined): undefined;
    public convert(entity?: RoleCreation): Promise<RoleEntity> | undefined;
    public convert(entity?: RoleCreation): Promise<RoleEntity> | undefined {
        if (isNil(entity)) {
            return undefined;
        }
        return this.convertNotNilEntity(entity);
    }

    private async convertNotNilEntity(dto: RoleCreation): Promise<RoleEntity> {
        const permissions = await this.permissionDao.findAll();
        return {
            id: randomUUID(),
            name: dto.name,
            type: dto.type,
            permissions: permissions.filter(entity => dto.permissions.includes(entity.permission)),
        };
    }

}
