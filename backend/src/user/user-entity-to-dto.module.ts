import {Module} from '@nestjs/common';
import {UserEntityToDtoConverter} from '@be/user/converter/user-entity-to-dto.converter';
import {UserEntityToBriefDtoConverter} from '@be/user/converter/user-entity-to-brief-dto.converter';
import {UserEntityToSettingsDtoConverter} from '@be/user/converter/user-entity-to-settings-dto.converter';

@Module({
    providers: [
        UserEntityToDtoConverter,
        UserEntityToSettingsDtoConverter,
        UserEntityToBriefDtoConverter
    ],
    exports: [
        UserEntityToDtoConverter,
        UserEntityToSettingsDtoConverter,
        UserEntityToBriefDtoConverter
    ]
})
export class UserEntityToDtoModule {
}
