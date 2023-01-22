import {Module} from '@nestjs/common';
import {UserEntityToDtoConverter} from '@be/user/converter/user-entity-to-dto.converter';

@Module({
    providers: [UserEntityToDtoConverter],
    exports: [UserEntityToDtoConverter]
})
export class UserEntityToDtoModule {
}
