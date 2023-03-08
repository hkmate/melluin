import {Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {UserDao} from '@be/user/user.dao';
import {UserEntity} from 'src/user/model/user.entity';
import * as crypto from 'crypto';
import {RoleEntity} from '@be/user/model/role.entity';
import {PersonEntity} from '@be/person/model/person.entity';
import {PersonDao} from '@be/person/person.dao';
import {User} from '@shared/user/user';
import {AuthToken} from '@shared/user/auth-token';
import {isNil, Nullable} from '@shared/util/util';
import {ConfigService} from '@nestjs/config';
import {DefaultSysAdmin} from '@be/config/model/default-sys-admin';
import {PasswordCryptService} from '@be/user/service/password-crypt.service';
import {UserEntityToDtoConverter} from '@be/user/converter/user-entity-to-dto.converter';

@Injectable()
export class AuthService {

    constructor(private readonly config: ConfigService,
                private readonly jwtService: JwtService,
                private readonly userService: UserDao,
                private readonly personService: PersonDao,
                private readonly userConverter: UserEntityToDtoConverter,
                private readonly passwordCryptService: PasswordCryptService) {
        const needToInitDefaultUser = this.config.get<boolean>('server.defaultSysAdmin.needToInit', false);
        if (needToInitDefaultUser) {
            this.initDefaultUser();
        }
    }

    public async validateUser(userName: string, pass: string): Promise<User> {
        const user: Nullable<UserEntity> = await this.userService.findOneByName(userName);

        if (isNil(user) || !user.isActive) {
            throw new UnauthorizedException('Wrong username or password');
        }

        if (!this.passwordCryptService.match(pass, user.password)) {
            throw new UnauthorizedException('Wrong username or password');
        }

        return this.userConverter.convert(user);
    }

    public getTokenFor(user: User): AuthToken {
        return {
            access_token: this.jwtService.sign({user}),
        };
    }

    private async initDefaultUser(): Promise<void> {
        const username: string = this.config.get('server.defaultSysAdmin.username')!;

        const sysadmin: UserEntity | null = await this.userService.findOneByName(username);
        if (isNil(sysadmin)) {
            await this.insertDefaultUserToDb();
        }
    }

    private async insertDefaultUserToDb(): Promise<void> {
        const defaultAdmin = this.config.get<DefaultSysAdmin>('server.defaultSysAdmin')!;
        const person: PersonEntity = await this.personService.save({
            id: crypto.randomUUID(),
            firstName: defaultAdmin.firstName,
            lastName: defaultAdmin.lastName
        });

        const roles: Array<RoleEntity> = await this.userService.findAllRole();
        await this.userService.save({
            id: crypto.randomUUID(),
            userName: defaultAdmin.username,
            password: this.passwordCryptService.encrypt(defaultAdmin.password),
            person,
            isActive: true,
            roles
        });
    }

}
