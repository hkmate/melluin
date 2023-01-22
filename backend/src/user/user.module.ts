import {Module} from '@nestjs/common';
import {UserDao} from './user.dao';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserEntity} from './model/user.entity';
import {RoleEntity} from './model/role.entity';
import {UserController} from '@be/user/user.controller';
import {UserCreationToEntityConverter} from '@be/user/converter/user-creation-to-entity.converter';
import {PersonHasNoUserYetValidator} from '@be/user/validator/person-has-no-user-yet.validator';
import {UsernameIsNotUsedValidator} from '@be/user/validator/username-is-not-used.validator';
import {PasswordCryptService} from '@be/user/service/password-crypt.service';
import {UserService} from '@be/user/service/user.service';
import {PersonModule} from '@be/person/person.module';
import {UserEntityToDtoModule} from '@be/user/user-entity-to-dto.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity,
            RoleEntity
        ]),

        PersonModule,
        UserEntityToDtoModule
    ],
    controllers: [UserController],
    providers: [
        UserDao,
        UserService,
        UserCreationToEntityConverter,
        PersonHasNoUserYetValidator,
        UsernameIsNotUsedValidator,
        PasswordCryptService,
    ],
    exports: [
        UserDao,
        UserService,
        PasswordCryptService
    ]
})
export class UserModule {
}
