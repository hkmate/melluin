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
import {PermissionEntity} from '@be/user/model/permission.entity';
import {UserRewriteApplierFactory} from '@be/user/applier/user-rewrite-applier.factory';
import {UserSettingsController} from '@be/user/user-settings.controller';
import {UserSettingsService} from '@be/user/service/user-settings.service';
import {RoleService} from '@be/user/service/role.service';
import {RoleController} from '@be/user/role.controller';
import {RoleDao} from '@be/user/role.dao';
import {PermissionDao} from '@be/user/permission.dao';
import {RoleCreationToEntityConverter} from '@be/user/converter/role-creation-to-entity.converter';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity,
            RoleEntity,
            PermissionEntity
        ]),

        PersonModule,
        UserEntityToDtoModule
    ],
    controllers: [UserController, UserSettingsController, RoleController],
    providers: [
        UserDao,
        UserService,
        RoleDao,
        PermissionDao,
        RoleService,
        UserSettingsService,
        UserCreationToEntityConverter,
        RoleCreationToEntityConverter,
        PersonHasNoUserYetValidator,
        UsernameIsNotUsedValidator,
        PasswordCryptService,
        UserRewriteApplierFactory
    ],
    exports: [
        UserDao,
        RoleDao,
        UserService,
        UserSettingsService,
        PasswordCryptService
    ]
})
export class UserModule {
}
