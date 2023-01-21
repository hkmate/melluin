import {Module} from '@nestjs/common';
import {UserDao} from './user.dao';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserEntity} from './model/user.entity';
import {RoleEntity} from './model/role.entity';
import {UserEntityToDtoConverter} from '@be/user/model/user-entity-to-dto.converter';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity,
            RoleEntity
        ])
    ],
    providers: [UserDao, UserEntityToDtoConverter],
    exports: [UserDao, UserEntityToDtoConverter]
})
export class UserModule {
}
