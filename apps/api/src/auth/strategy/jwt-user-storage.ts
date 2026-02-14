import {Injectable, NotFoundException} from '@nestjs/common';
import {isNil} from '@shared/util/util';
import {UserEntityToDtoConverter} from '@be/user/converter/user-entity-to-dto.converter';
import {User} from '@shared/user/user';
import {UserDao} from '@be/user/user.dao';

@Injectable()
export class JwtUserStorage {

    private static readonly CACHE_TIMEOUT = 120_000; // 20 min

    constructor(private readonly userDao: UserDao,
                private readonly userConverter: UserEntityToDtoConverter) {
    }

    public async getById(id: string): Promise<User> {
        const entity = await this.userDao.find({where: {id}, cache: JwtUserStorage.CACHE_TIMEOUT});
        if (isNil(entity) || !entity.isActive) {
            throw new NotFoundException(`User not found with id: ${id}`);
        }
        return this.userConverter.convert(entity);
    }

}
