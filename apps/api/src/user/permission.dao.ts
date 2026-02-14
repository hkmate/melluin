import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {PermissionEntity} from '@be/user/model/permission.entity';

@Injectable()
export class PermissionDao {

    constructor(@InjectRepository(PermissionEntity)
                private readonly repository: Repository<PermissionEntity>) {
    }

    public findAll(): Promise<Array<PermissionEntity>> {
        return this.repository.find();
    }

}
