import {Injectable, NotFoundException} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {UserEntity} from './model/user.entity';
import {isNil, toOptional} from '@shared/util/util';
import {FindOneOptions} from 'typeorm/find-options/FindOneOptions';

@Injectable()
export class UserDao {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>) {
    }

    public save(user: UserEntity): Promise<UserEntity> {
        return this.userRepository.save(user);
    }

    public find(options: FindOneOptions<UserEntity>): Promise<UserEntity | undefined> {
        return this.userRepository.findOne(options).then(toOptional);
    }

    public findOneByName(userName: string): Promise<UserEntity | undefined> {
        return this.userRepository.findOne({where: {userName}}).then(toOptional);
    }

    public findOneWithCache(userName: string): Promise<UserEntity | undefined> {
        return this.userRepository.findOne({where: {userName}, cache: 3000}).then(toOptional);
    }

    public hasAnyWithRole(roleId: string): Promise<boolean> {
        return this.userRepository.exist({where: {roles: {id: roleId}}});
    }

    public getOne(id: string): Promise<UserEntity> {
        return this.userRepository.findOne({where: {id}})
            .then(entity => {
                if (isNil(entity)) {
                    throw new NotFoundException(`User not found with id: ${id}`);
                }
                return entity;
            });
    }

}
