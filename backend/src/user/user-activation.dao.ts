import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {UserEntity} from './model/user.entity';
import {UserActivationEntity} from '@be/user/model/user-activation.entity';
import {UserActivation} from '@be/user/model/user-activation';
import {now} from '@be/util/util';
import {randomUUID} from 'crypto';

@Injectable()
export class UserActivationDao {

    constructor(
        @InjectRepository(UserActivationEntity)
        private readonly userActivationRepository: Repository<UserActivationEntity>) {
    }

    public saveBy(user: UserEntity, action: UserActivation): Promise<UserActivationEntity> {
        return this.userActivationRepository.save({
            action,
            user,
            createdAt: now(),
            id: randomUUID(),
        } satisfies  UserActivationEntity);
    }

}
