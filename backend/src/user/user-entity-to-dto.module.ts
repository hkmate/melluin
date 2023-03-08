import {Module} from '@nestjs/common';
import {UserEntityToDtoConverter} from '@be/user/converter/user-entity-to-dto.converter';
import {UserEntityToBriefDtoConverter} from '@be/user/converter/user-entity-to-brief-dto.converter';

@Module({
    providers: [
        UserEntityToDtoConverter,
        UserEntityToBriefDtoConverter
    ],
    exports: [
        UserEntityToDtoConverter,
        UserEntityToBriefDtoConverter
    ]
})
export class UserEntityToDtoModule {
}
