import {Injectable} from '@nestjs/common';
import {isNil} from '@shared/util/util';
import {Converter} from '@shared/converter';
import {RoleEntity} from '@be/user/model/role.entity';
import {RoleBrief} from '@shared/user/role';

@Injectable()
export class RoleEntityToBriefDtoConverter implements Converter<RoleEntity, RoleBrief> {

    public convert(entity: RoleEntity): RoleBrief;
    public convert(entity: undefined): undefined;
    public convert(entity?: RoleEntity): RoleBrief | undefined;
    public convert(entity?: RoleEntity): RoleBrief | undefined {
        if (isNil(entity)) {
            return undefined;
        }
        return this.convertNotNilEntity(entity);
    }

    private convertNotNilEntity(entity: RoleEntity): RoleBrief {
        return {
            name: entity.name,
            type: entity.type
        }
    }

}
