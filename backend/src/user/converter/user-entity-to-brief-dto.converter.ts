import {UserEntity} from '@be/user/model/user.entity';
import {BriefUser} from '@shared/user/user';
import {Injectable} from '@nestjs/common';
import {isNil} from '@shared/util/util';
import {Converter} from '@shared/converter';

@Injectable()
export class UserEntityToBriefDtoConverter implements Converter<UserEntity, BriefUser> {

    public convert(entity: UserEntity): BriefUser;
    public convert(entity: undefined): undefined;
    public convert(entity?: UserEntity): BriefUser | undefined;
    public convert(entity?: UserEntity): BriefUser | undefined {
        if (isNil(entity)) {
            return undefined;
        }
        return this.convertNotNilEntity(entity);
    }

    private convertNotNilEntity(entity: UserEntity): BriefUser {
        return {
            id: entity.id,
            personId: entity.person.id,
            isActive: entity.isActive,
            roles: entity.roles?.map(roleEntity => roleEntity.role)
        };
    }

}
