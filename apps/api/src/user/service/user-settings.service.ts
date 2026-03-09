import {Injectable} from '@nestjs/common';
import {UserDao} from '@be/user/user.dao';
import {User, UserSettings, UUID} from '@melluin/common';
import {UserEntityToSettingsDtoConverter} from '@be/user/converter/user-entity-to-settings-dto.converter';

@Injectable()
export class UserSettingsService {

    constructor(private readonly userDao: UserDao,
                private readonly settingsConverter: UserEntityToSettingsDtoConverter) {
    }

    public async get(userId: UUID, requester: User): Promise<UserSettings> {
        const entity = await this.userDao.getOne(userId);
        return this.settingsConverter.convert(entity);
    }

    public async update(userId: UUID, newSettings: UserSettings, requester: User): Promise<UserSettings> {
        const entity = await this.userDao.getOne(userId);
        entity.settings = newSettings;
        const savedEntity = await this.userDao.save(entity);
        return this.settingsConverter.convert(savedEntity);
    }

}
