import {Injectable, NotFoundException} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {RoleEntity} from './model/role.entity';
import {isNil} from '@shared/util/util';
import {Role} from '@shared/user/role.enum';

@Injectable()
export class RoleDao {

    constructor(@InjectRepository(RoleEntity)
                private readonly roleRepository: Repository<RoleEntity>) {
    }

    public save(entity: RoleEntity): Promise<RoleEntity> {
        return this.roleRepository.save(entity);
    }

    public findAll(): Promise<Array<RoleEntity>> {
        return this.roleRepository.find();
    }

    public find(role: Role): Promise<RoleEntity> {
        return this.roleRepository.findOneBy({role})
            .then(entity => {
                if (isNil(entity)) {
                    throw new NotFoundException(`Role not found with name: ${role}`);
                }
                return entity;
            });
    }

}
