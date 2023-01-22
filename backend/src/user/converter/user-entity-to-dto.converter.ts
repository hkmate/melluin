import {UserEntity} from '@be/user/model/user.entity';
import {User} from '@shared/user/user';
import {Injectable} from '@nestjs/common';
import {isNil} from '@shared/util/util';
import {Converter} from '@shared/converter';

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
            customInfo: entity.customInfo,
            roles: entity.roles?.map(roleEntity => roleEntity.role)
        };
    }

}
