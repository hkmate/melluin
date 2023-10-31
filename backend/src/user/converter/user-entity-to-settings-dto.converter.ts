import {UserEntity} from '@be/user/model/user.entity';
import {Injectable} from '@nestjs/common';
import {isNil} from '@shared/util/util';
import {Converter} from '@shared/converter';
import {UserSettings} from '@shared/user/user-settings';

@Injectable()
export class UserEntityToSettingsDtoConverter implements Converter<UserEntity, UserSettings> {

    public convert(entity: UserEntity): UserSettings;
    public convert(entity: undefined): undefined;
    public convert(entity?: UserEntity): UserSettings | undefined;
    public convert(entity?: UserEntity): UserSettings | undefined {
        if (isNil(entity)) {
            return undefined;
        }
        return this.convertNotNilEntity(entity);
    }

    private convertNotNilEntity(entity: UserEntity): UserSettings {
        return {
            ...entity.settings
        };
    }

}
