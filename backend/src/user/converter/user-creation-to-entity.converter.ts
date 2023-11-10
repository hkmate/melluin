import {isNil} from '@shared/util/util';
import {Converter} from '@shared/converter';
import {randomUUID} from 'crypto';
import {UserCreation} from '@shared/user/user-creation';
import {UserEntity} from '@be/user/model/user.entity';
import {Injectable} from '@nestjs/common';
import {PersonDao} from '@be/person/person.dao';
import {PasswordCryptService} from '@be/user/service/password-crypt.service';
import {RoleDao} from '@be/user/role.dao';
import {PermissionDao} from '@be/user/permission.dao';

@Injectable()
export class UserCreationToEntityConverter implements Converter<UserCreation, Promise<UserEntity>> {

    constructor(private readonly personDao: PersonDao,
                private readonly roleDao: RoleDao,
                private readonly permissionDao: PermissionDao,
                private readonly passwordEncoder: PasswordCryptService) {
    }

    public convert(value: UserCreation): Promise<UserEntity>;
    public convert(value: undefined): undefined;
    public convert(entity?: UserCreation): Promise<UserEntity> | undefined;
    public convert(entity?: UserCreation): Promise<UserEntity> | undefined {
        if (isNil(entity)) {
            return undefined;
        }
        return this.convertNotNilEntity(entity);
    }

    private async convertNotNilEntity(dto: UserCreation): Promise<UserEntity> {
        const person = (await this.personDao.findOneWithCache(dto.personId))!;
        const roles = await this.roleDao.findAll();
        const permissions = await this.permissionDao.findAll();
        return {
            id: randomUUID(),
            person,
            userName: dto.userName,
            password: this.passwordEncoder.encrypt(dto.password),
            settings: {},
            isActive: true,
            roles: roles.filter(entity => dto.roles.includes(entity.role)),
            customPermissions: permissions.filter(entity => dto.customPermissions.includes(entity.permission)),
        };
    }

}
