import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {UserService} from '@be/user/user.service';
import {PasswordCryptService} from './password-crypt.service';
import {UserEntity} from 'src/user/model/user.entity';
import * as crypto from 'crypto';
import {RoleEntity} from '@be/user/model/role.entity';
import {PersonEntity} from '@be/person/model/person.entity';
import {PersonService} from '@be/person/person.service';
import {User} from '@shared/user/user';
import {AuthToken} from '@shared/user/auth-token';
import {isNil, Nullable} from '@shared/util/util';
import {ConfigService} from '@nestjs/config';
import {DefaultSysAdmin} from '@be/config/model/default-sys-admin';

@Injectable()
export class AuthService {

    constructor(private readonly config: ConfigService,
                private readonly jwtService: JwtService,
                private readonly userService: UserService,
                private readonly personService: PersonService,
                private readonly passwordCryptService: PasswordCryptService) {
        const needToInitDefaultUser = this.config.get<boolean>('server.defaultSysAdmin.needToInit', false);
        if (needToInitDefaultUser) {
            this.initDefaultUser();
        }
    }

    public async validateUser(userName: string, pass: string): Promise<Nullable<User>> {
        const user: Nullable<UserEntity> = await this.userService.findOne(userName);

        if (isNil(user)) {
            return null;
        }

        if (!user.isActive) {
            return null;
        }

        if (this.passwordCryptService.match(pass, user.password)) {
            return {
                id: user.id,
                userName: user.userName,
                roles: user.roles.map((roleEntity: RoleEntity) => roleEntity.role),
                isActive: user.isActive
            };
        }
        return null;
    }

    public getTokenFor(user: User): AuthToken {
        return {
            access_token: this.jwtService.sign({user}),
        };
    }

    private async initDefaultUser(): Promise<void> {
        const username: string = this.config.get('server.defaultSysAdmin.username')!;

        const sysadmin: UserEntity | null = await this.userService.findOne(username);
        if (isNil(sysadmin)) {
            await this.insertDefaultUserToDb();
        }
    }

    private async insertDefaultUserToDb(): Promise<void> {
        const defaultAdmin = this.config.get<DefaultSysAdmin>('server.defaultSysAdmin')!;
        const userName: string = defaultAdmin.username;
        const firstName: string = defaultAdmin.firstName;
        const lastName: string = defaultAdmin.lastName;
        const rawPassword: string = defaultAdmin.password;
        const password: string = this.passwordCryptService.encrypt(rawPassword);
        const userId: string = crypto.randomUUID();
        const person: PersonEntity = await
            this.personService.save({id: crypto.randomUUID(), firstName, lastName});

        const roles: Array<RoleEntity> = await this.userService.findAllRole();
        await this.userService.save({
            id: userId,
            userName,
            password,
            person,
            isActive: true,
            roles
        });
    }

}
