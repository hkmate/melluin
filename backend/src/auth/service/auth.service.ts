import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDao } from '@be/user/user.dao';
import { UserEntity } from 'src/user/model/user.entity';
import * as crypto from 'crypto';
import { RoleEntity } from '@be/user/model/role.entity';
import { PersonEntity } from '@be/person/model/person.entity';
import { PersonDao } from '@be/person/person.dao';
import { AuthInfo } from '@shared/user/auth-info';
import { isNil } from '@shared/util/util';
import { ConfigService } from '@nestjs/config';
import { DefaultSysAdmin } from '@be/config/model/default-sys-admin';
import { PasswordCryptService } from '@be/user/service/password-crypt.service';
import { UserEntityToDtoConverter } from '@be/user/converter/user-entity-to-dto.converter';
import { AuthCredentials } from '@shared/user/auth-credentials';
import { UserEntityToSettingsDtoConverter } from '@be/user/converter/user-entity-to-settings-dto.converter';
import { User } from '@shared/user/user';
import { UserSettings } from '@shared/user/user-settings';
import { RoleDao } from '@be/user/role.dao';

@Injectable()
export class AuthService {

    constructor(private readonly config: ConfigService,
                private readonly jwtService: JwtService,
                private readonly userDao: UserDao,
                private readonly roleDao: RoleDao,
                private readonly personDao: PersonDao,
                private readonly userConverter: UserEntityToDtoConverter,
                private readonly userSettingsConverter: UserEntityToSettingsDtoConverter,
                private readonly passwordCryptService: PasswordCryptService) {
        const needToInitDefaultUser = this.config.get<boolean>('server.defaultSysAdmin.needToInit', false);
        if (needToInitDefaultUser) {
            this.initDefaultUser();
        }
    }

    public async validate(credentials: AuthCredentials): Promise<void> {
        const user: UserEntity | undefined = await this.userDao.findOneWithCache(credentials.username);

        if (isNil(user) || !user.isActive) {
            throw new BadRequestException('Wrong username or password');
        }

        if (!this.passwordCryptService.match(credentials.password, user.password)) {
            throw new BadRequestException('Wrong username or password');
        }
    }

    public async getTokenFor(credentials: AuthCredentials): Promise<AuthInfo> {
        const userEntity: UserEntity | undefined = await this.userDao.findOneWithCache(credentials.username);
        const user: User = this.userConverter.convert(userEntity!);
        const userSettings: UserSettings = this.userSettingsConverter.convert(userEntity!);
        return {
            accessToken: this.jwtService.sign({ userId: user.id }),
            user,
            userSettings,
        };
    }

    private async initDefaultUser(): Promise<void> {
        const username: string = this.config.get('server.defaultSysAdmin.username')!;

        const sysadmin: UserEntity | undefined = await this.userDao.findOneByName(username);
        if (isNil(sysadmin)) {
            await this.createDefaultUser();
        }
    }

    private async createDefaultUser(): Promise<void> {
        const defaultAdmin = this.config.get<DefaultSysAdmin>('server.defaultSysAdmin')!;
        const person: PersonEntity = await this.insertDefaultAdminPerson(defaultAdmin);
        await this.insertDefaultAdminUser(defaultAdmin, person);
    }

    private insertDefaultAdminPerson(defaultAdmin: DefaultSysAdmin): Promise<PersonEntity> {
        return this.personDao.save({
            id: crypto.randomUUID(),
            firstName: defaultAdmin.firstName,
            lastName: defaultAdmin.lastName,
            email: null,
            phone: null,
            user: null,
            preferences: null,
        });
    }

    private async insertDefaultAdminUser(defaultAdmin: DefaultSysAdmin, person: PersonEntity): Promise<UserEntity> {
        const roles: Array<RoleEntity> = await this.roleDao.findAll();
        return this.userDao.save({
            id: crypto.randomUUID(),
            userName: defaultAdmin.username,
            password: this.passwordCryptService.encrypt(defaultAdmin.password),
            person,
            customPermissions: [],
            isActive: true,
            roles,
        });
    }

}
