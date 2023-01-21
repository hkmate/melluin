import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {UserEntity} from './model/user.entity';
import {RoleEntity} from './model/role.entity';

@Injectable()
export class UserDao {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(RoleEntity)
        private readonly roleRepository: Repository<RoleEntity>) {
    }

    public save(user: UserEntity): Promise<UserEntity> {
        return this.userRepository.save(user);
    }

    public findAllRole(): Promise<Array<RoleEntity>> {
        return this.roleRepository.find();
    }

    public findOne(userName: string): Promise<UserEntity | null> {
        return this.userRepository.findOne({where: {userName}, relations: {person: true, roles: true}});
    }

}
