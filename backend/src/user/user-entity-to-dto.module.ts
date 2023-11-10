import {Module} from '@nestjs/common';
import {UserEntityToDtoConverter} from '@be/user/converter/user-entity-to-dto.converter';
import {UserEntityToBriefDtoConverter} from '@be/user/converter/user-entity-to-brief-dto.converter';
import {UserEntityToSettingsDtoConverter} from '@be/user/converter/user-entity-to-settings-dto.converter';
import {RoleEntityToDtoConverter} from '@be/user/converter/role-entity-to-dto.converter';

@Module({
    providers: [
        UserEntityToDtoConverter,
        UserEntityToSettingsDtoConverter,
        UserEntityToBriefDtoConverter,
        RoleEntityToDtoConverter
    ],
    exports: [
        UserEntityToDtoConverter,
        UserEntityToSettingsDtoConverter,
        UserEntityToBriefDtoConverter,
        RoleEntityToDtoConverter
    ]
})
export class UserEntityToDtoModule {
}
