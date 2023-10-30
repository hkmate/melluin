import {Injectable} from '@nestjs/common';
import {UserDao} from '@be/user/user.dao';
import {User, UserSettings} from '@shared/user/user';
import {UserEntityToSettingsDtoConverter} from '@be/user/converter/user-entity-to-settings-dto.converter';

@Injectable()
export class UserSettingsService {

    constructor(private readonly userDao: UserDao,
                private readonly settingsConverter: UserEntityToSettingsDtoConverter) {
    }

    public async get(userId: string, requester: User): Promise<UserSettings> {
        const entity = await this.userDao.getOne(userId);
        return this.settingsConverter.convert(entity);
    }

    public async update(userId: string, newSettings: UserSettings, requester: User): Promise<UserSettings> {
        const entity = await this.userDao.getOne(userId);
        entity.settings = newSettings;
        const savedEntity = await this.userDao.save(entity);
        return this.settingsConverter.convert(savedEntity);
    }

}
