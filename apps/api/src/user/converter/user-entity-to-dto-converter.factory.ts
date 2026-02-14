import {Injectable} from '@nestjs/common';
import {Converter} from '@shared/converter/converter';
import {User} from '@shared/user/user';
import {ConverterChain} from '@shared/converter/converter-chain';
import {UserEntityToDtoConverter} from '@be/user/converter/user-entity-to-dto.converter';
import {UserEntity} from '@be/user/model/user.entity';
import {HideUserCreateDataConverter} from '@be/user/converter/hide-user-create-data.converter';
import {HideUserLastLoginDataConverter} from '@be/user/converter/hide-user-last-login-data.converter';

@Injectable()
export class UserEntityToDtoConverterFactory {

    constructor(private readonly userEntityToDtoConverter: UserEntityToDtoConverter) {
    }

    public createFor(requester: User): Converter<UserEntity, User> {
        return ConverterChain.of(
            this.userEntityToDtoConverter,
            new HideUserCreateDataConverter(requester),
            new HideUserLastLoginDataConverter(requester),
        );
    }

}
