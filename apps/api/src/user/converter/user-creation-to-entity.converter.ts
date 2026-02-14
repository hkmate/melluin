import { isNil } from '@shared/util/util';
import { Converter } from '@shared/converter/converter';
import { randomUUID } from 'crypto';
import { UserCreation } from '@shared/user/user-creation';
import { UserEntity } from '@be/user/model/user.entity';
import { Injectable } from '@nestjs/common';
import { PersonDao } from '@be/person/person.dao';
import { PasswordCryptService } from '@be/user/service/password-crypt.service';
import { RoleDao } from '@be/user/role.dao';
import { PermissionDao } from '@be/user/permission.dao';
import { now } from '@be/util/util';
import { User } from '@shared/user/user';

interface UserCreationRequest {
    newUser: UserCreation,
    requester: User
}

@Injectable()
export class UserCreationToEntityConverter implements Converter<UserCreationRequest, Promise<UserEntity>> {

    constructor(private readonly personDao: PersonDao,
                private readonly roleDao: RoleDao,
                private readonly permissionDao: PermissionDao,
                private readonly passwordEncoder: PasswordCryptService) {
    }

    public convert(value: UserCreationRequest): Promise<UserEntity>;
    public convert(value: undefined): undefined;
    public convert(entity?: UserCreationRequest): Promise<UserEntity> | undefined;
    public convert(entity?: UserCreationRequest): Promise<UserEntity> | undefined {
        if (isNil(entity)) {
            return undefined;
        }
        return this.convertNotNilEntity(entity);
    }

    private async convertNotNilEntity({ newUser, requester }: UserCreationRequest): Promise<UserEntity> {
        const person = (await this.personDao.findOneWithCache(newUser.personId))!;
        const roles = await this.roleDao.findAll();
        const permissions = await this.permissionDao.findAll();
        return {
            id: randomUUID(),
            person,
            userName: newUser.userName,
            password: this.passwordEncoder.encrypt(newUser.password),
            settings: {},
            isActive: true,
            roles: roles.filter(entity => newUser.roleNames.includes(entity.name)),
            customPermissions: permissions.filter(entity => newUser.customPermissions.includes(entity.permission)),
            lastLogin: null,
            created: now(),
            createdByPersonId: requester.personId,
        };
    }

}
