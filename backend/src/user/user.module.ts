import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserEntity} from './model/user.entity';
import {RoleEntity} from './model/role.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity,
            RoleEntity
        ])
    ],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {
}
