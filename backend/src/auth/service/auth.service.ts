import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {UserService} from '../../user/user.service';
import {PasswordCryptService} from './password-crypt.service';
import * as CONFIG from '@resources/server-config.json';
import {UserEntity} from 'src/user/model/user.entity';
import * as crypto from 'crypto';
import {RoleEntity} from '../../user/model/role.entity';
import {PersonEntity} from '../../person/model/person.entity';
import {PersonService} from '../../person/person.service';
import {User} from '@shared/user/user';
import {AuthToken} from '@shared/user/auth-token';

@Injectable()
export class AuthService {

    constructor(private readonly jwtService: JwtService,
                private readonly userService: UserService,
                private readonly personService: PersonService,
                private readonly passwordCryptService: PasswordCryptService) {
        this.initDefaultUser();
    }

    public async validateUser(username: string, pass: string): Promise<unknown> {
        const user = await this.userService.findOne(username);

        if (!user) {
            return null;
        }

        if (this.passwordCryptService.match(pass, user.password)) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {password, ...result} = user;
            return result;
        }
        return null;
    }

    public login(user: User): AuthToken {
        return {
            access_token: this.jwtService.sign({user}),
        };
    }

    private async initDefaultUser(): Promise<void> {
        const username: string = CONFIG.server.defaultSysAdmin.username;

        const sysadmin: UserEntity | null = await this.userService.findOne(username);
        if (sysadmin === null) {
            await this.insertDefaultUserToDb();
        }
    }

    private async insertDefaultUserToDb(): Promise<void> {
        const username: string = CONFIG.server.defaultSysAdmin.username;
        const firstName: string = CONFIG.server.defaultSysAdmin.firstName;
        const lastName: string = CONFIG.server.defaultSysAdmin.lastName;
        const rawPassword: string = CONFIG.server.defaultSysAdmin.password;
        const password: string = this.passwordCryptService.encrypt(rawPassword);
        const userId: string = crypto.randomUUID();
        const person: PersonEntity = await
            this.personService.save({id: crypto.randomUUID(), firstName, lastName});

        const roles: Array<RoleEntity> = await this.userService.findAllRole();
        await this.userService.save({
            id: userId,
            username,
            password,
            person,
            isActive: true,
            roles
        });
    }

}
