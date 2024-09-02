import {Injectable, NotFoundException} from '@nestjs/common';
import {In, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {RoleEntity} from './model/role.entity';
import {isNil} from '@shared/util/util';
import {RoleType} from '@shared/user/role';

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

    public findById(id: string): Promise<RoleEntity> {
        return this.roleRepository.findOneBy({id})
            .then(entity => {
                if (isNil(entity)) {
                    throw new NotFoundException(`Role not found with id: ${id}`);
                }
                return entity;
            });
    }

    public existsByName(name: string): Promise<boolean> {
        return this.roleRepository.exist({where: {name}});
    }

    public findAllByName(names: Array<string>): Promise<Array<RoleEntity>> {
        return this.roleRepository.findBy({name: In(names)})
            .then(entities => {
                if (isNil(entities) || entities.length !== names.length) {
                    throw new NotFoundException('There are role names that not found.');
                }
                return entities;
            });
    }

    public find(role: RoleType): Promise<RoleEntity> {
        return this.roleRepository.findOneBy({type: role})
            .then(entity => {
                if (isNil(entity)) {
                    throw new NotFoundException(`Role not found with type: ${role}`);
                }
                return entity;
            });
    }

    public delete(entity: RoleEntity): Promise<RoleEntity> {
        return this.roleRepository.remove(entity);
    }

}
