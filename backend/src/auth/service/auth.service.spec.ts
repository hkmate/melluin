import {Test} from '@nestjs/testing';
import {AuthService} from '@be/auth/service/auth.service';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';
import {UserService} from '@be/user/user.service';
import {PersonService} from '@be/person/person.service';
import {PasswordCryptService} from '@be/auth/service/password-crypt.service';
import {DefaultSysAdmin} from '@be/config/model/default-sys-admin';
import {cast, randomString} from '@shared/util/test-util';
import {Role} from '@shared/user/role.enum';
import {PersonEntity} from '@be/person/model/person.entity';
import {UserEntity} from '@be/user/model/user.entity';
import * as crypto from 'crypto';
import {randomUUID} from 'crypto';
import {User} from '@shared/user/user';
import {AuthToken} from '@shared/user/auth-token';
import Mock = jest.Mock;
import {when} from 'jest-when';
import {Nullable} from '@shared/util/util';

describe('AuthService', () => {
    describe('Construct when default user not needed', () => {
        let userService: UserService;
        let personService: PersonService;

        beforeEach(async () => {
            const configServiceGet = jest.fn().mockImplementation((paramName: string) => {
                if (paramName === 'server.defaultSysAdmin.needToInit') {
                    return false;
                }
                return null;
            });

            const moduleRef = await Test.createTestingModule({
                providers: [
                    AuthService,
                    {provide: ConfigService, useValue: {get: configServiceGet}},
                    {provide: JwtService, useValue: {}},
                    {provide: UserService, useValue: {save: jest.fn(), findAllRole: jest.fn()}},
                    {provide: PersonService, useValue: {save: jest.fn()}},
                    {provide: PasswordCryptService, useValue: {}},
                ],
            }).compile();

            userService = moduleRef.get<UserService>(UserService);
            personService = moduleRef.get<PersonService>(PersonService);
        });

        it('Then Person-, UserService not called', () => {
            expect(userService.findAllRole).not.toBeCalled();
            expect(userService.save).not.toBeCalled();
            expect(personService.save).not.toBeCalled();
        });
    });

    describe('Construct when default user needed and not present', () => {
        let userService: UserService;
        let personService: PersonService;
        const defaultUser: DefaultSysAdmin = {
            firstName: randomString(),
            lastName: randomString(),
            password: randomString(),
            username: randomString(),
            needToInit: true
        };
        const mockedPersonId = 'c3121569-ccb8-4600-b07b-3f59b4a477fa';
        const mockedUserId = 'c0b74770-5be3-4d44-84c8-596f244488c9';
        const expectedRoles = [{id: randomString(), role: Role.SYSADMIN}];
        const expectedPassword = randomString();

        beforeEach(async () => {
            const configServiceGet = jest.fn().mockImplementation((paramName: string) => {
                if (paramName === 'server.defaultSysAdmin.needToInit') {
                    return true;
                }
                if (paramName === 'server.defaultSysAdmin.username') {
                    return defaultUser.username;
                }
                if (paramName === 'server.defaultSysAdmin') {
                    return defaultUser;
                }
                return null;
            });
            jest.spyOn(crypto, 'randomUUID')
                .mockReturnValueOnce(mockedUserId)
                .mockReturnValueOnce(mockedPersonId);

            const passwordCryptServiceEncrypt = jest.fn(pass => {
                if (pass === defaultUser.password) {
                    return expectedPassword;
                }
                return null;
            });
            const userServiceFindAllRole = jest.fn(() => expectedRoles);

            const moduleRef = await Test.createTestingModule({
                providers: [
                    AuthService,
                    {provide: ConfigService, useValue: {get: configServiceGet}},
                    {provide: JwtService, useValue: {}},
                    {
                        provide: UserService, useValue: {
                            findOne: jest.fn().mockReturnValueOnce(null),
                            save: jest.fn(arg => arg),
                            findAllRole: userServiceFindAllRole
                        }
                    },
                    {provide: PersonService, useValue: {save: jest.fn(arg => arg),}},
                    {provide: PasswordCryptService, useValue: {encrypt: passwordCryptServiceEncrypt}},
                ],
            }).compile();

            userService = moduleRef.get<UserService>(UserService);
            personService = moduleRef.get<PersonService>(PersonService);
        });

        it('Then Person-, UserService called with filled objects', () => {
            const expectedPerson: PersonEntity = {
                id: mockedPersonId,
                firstName: defaultUser.firstName,
                lastName: defaultUser.lastName,
            };
            const expectedUser: UserEntity = {
                id: mockedUserId,
                roles: expectedRoles,
                person: expectedPerson,
                userName: defaultUser.username,
                password: expectedPassword,
                isActive: true
            };

            expect(userService.findOne).toBeCalledWith(defaultUser.username);
            expect(userService.findAllRole).toBeCalled();
            expect(personService.save).toBeCalledWith(expectedPerson);
            expect(userService.save).toBeCalledWith(expectedUser);
        });
    });

    describe('Construct when default user needed and present', () => {
        let userService: UserService;
        let personService: PersonService;
        const defaultUser: DefaultSysAdmin = {
            firstName: randomString(),
            lastName: randomString(),
            password: randomString(),
            username: randomString(),
            needToInit: true
        };

        beforeEach(async () => {
            const configServiceGet = jest.fn().mockImplementation((paramName: string) => {
                if (paramName === 'server.defaultSysAdmin.needToInit') {
                    return true;
                }
                if (paramName === 'server.defaultSysAdmin.username') {
                    return defaultUser.username;
                }
                return null;
            });

            const moduleRef = await Test.createTestingModule({
                providers: [
                    AuthService,
                    {provide: ConfigService, useValue: {get: configServiceGet}},
                    {provide: JwtService, useValue: {}},
                    {
                        provide: UserService, useValue: {
                            findOne: jest.fn().mockReturnValueOnce({username: defaultUser.username}),
                            save: jest.fn(),
                            findAllRole: jest.fn()
                        }
                    },
                    {provide: PersonService, useValue: {save: jest.fn()}},
                    {provide: PasswordCryptService, useValue: {encrypt: jest.fn()}},
                ],
            }).compile();

            userService = moduleRef.get<UserService>(UserService);
            personService = moduleRef.get<PersonService>(PersonService);
        });

        it('Then Person-, UserService not called except UserService.findOne', () => {
            expect(userService.findOne).toBeCalledWith(defaultUser.username);
            expect(userService.findAllRole).not.toBeCalled();
            expect(personService.save).not.toBeCalled();
            expect(userService.save).not.toBeCalled();
        });
    });

    describe('getTokenFor', () => {
        let authService: AuthService;
        let jwtService: JwtService;
        let configService: ConfigService;

        beforeEach(async () => {
            const moduleRef = await Test.createTestingModule({
                providers: [
                    AuthService,
                    {provide: ConfigService, useValue: {get: jest.fn(() => false)}},
                    {provide: JwtService, useValue: {sign: jest.fn()}},
                    {provide: UserService, useValue: {}},
                    {provide: PersonService, useValue: {}},
                    {provide: PasswordCryptService, useValue: {}},
                ],
            }).compile();

            authService = moduleRef.get<AuthService>(AuthService);
            jwtService = moduleRef.get<JwtService>(JwtService);
            configService = moduleRef.get<ConfigService>(ConfigService);
        });

        it('When user is valid Then token returned with wrapped user', () => {
            const user: User = {
                id: randomString(),
                password: randomString(),
                userName: randomString(),
                roles: [Role.SYSADMIN],
                isActive: true
            }
            const expectedTokenStr = `&@${JSON.stringify(user)}@&`;
            const expectedToken: AuthToken = {access_token: expectedTokenStr};
            (jwtService.sign as Mock).mockReturnValueOnce(expectedTokenStr);

            const result: AuthToken = authService.getTokenFor(user);

            expect(result).toEqual(expectedToken);
            expect(jwtService.sign).toBeCalledWith({user});
            expect(configService.get).toBeCalledWith('server.defaultSysAdmin.needToInit', false);
        });
    });


    describe('validateUser', () => {
        let authService: AuthService;
        let userService: UserService;
        let passwordCryptService: PasswordCryptService;

        beforeEach(async () => {
            const moduleRef = await Test.createTestingModule({
                providers: [
                    AuthService,
                    {provide: ConfigService, useValue: {get: jest.fn(() => false)}},
                    {provide: JwtService, useValue: {sign: jest.fn()}},
                    {provide: UserService, useValue: {findOne: jest.fn()}},
                    {provide: PersonService, useValue: {}},
                    {provide: PasswordCryptService, useValue: {match: jest.fn()}},
                ],
            }).compile();

            authService = moduleRef.get<AuthService>(AuthService);
            userService = moduleRef.get<UserService>(UserService);
            passwordCryptService = moduleRef.get<PasswordCryptService>(PasswordCryptService);
        });

        it('When user is in db and active and password is correct Then user object returned without password', async () => {
            const userId: string = randomUUID();
            const userName: string = randomString();
            const password: string = randomString();
            const userEntity: UserEntity = {
                userName, password,
                id: userId,
                person: cast<PersonEntity>({}),
                isActive: true,
                roles: [{id: randomUUID(), role: Role.SYSADMIN}]
            };
            const expectedUser: User = {
                id: userId,
                userName,
                roles: [Role.SYSADMIN],
                isActive: true
            }
            const rawPassword: string = randomString();
            when(userService.findOne).calledWith(userName).mockReturnValue(Promise.resolve(userEntity));
            when(passwordCryptService.match).calledWith(rawPassword, password).mockReturnValue(true);

            const result: Nullable<User> = await authService.validateUser(userName, rawPassword);

            expect(result).toEqual(expectedUser);
        });

        it('When user is in db and active and password is not correct Then null returned', async () => {
            const userId: string = randomUUID();
            const userName: string = randomString();
            const password: string = randomString();
            const userEntity: UserEntity = {
                userName, password,
                id: userId,
                person: cast<PersonEntity>({}),
                isActive: true,
                roles: [{id: randomUUID(), role: Role.SYSADMIN}]
            };
            const rawPassword: string = randomString();
            when(userService.findOne).calledWith(userName).mockReturnValue(Promise.resolve(userEntity));
            when(passwordCryptService.match).calledWith(rawPassword, password).mockReturnValue(false);

            const result: Nullable<User> = await authService.validateUser(userName, rawPassword);

            expect(result).toBeNull();
        });

        it('When user is in db and is not active Then null returned', async () => {
            const userId: string = randomUUID();
            const userName: string = randomString();
            const password: string = randomString();
            const userEntity: UserEntity = {
                userName, password,
                id: userId,
                person: cast<PersonEntity>({}),
                isActive: false,
                roles: [{id: randomUUID(), role: Role.SYSADMIN}]
            };
            const rawPassword: string = randomString();
            when(userService.findOne).calledWith(userName).mockReturnValue(Promise.resolve(userEntity));

            const result: Nullable<User> = await authService.validateUser(userName, rawPassword);

            expect(result).toBeNull();
        });

        it('When user is not in dbThen null returned', async () => {
            const userName: string = randomString();
            const rawPassword: string = randomString();
            when(userService.findOne).calledWith(userName).mockReturnValue(Promise.resolve(null));

            const result: Nullable<User> = await authService.validateUser(userName, rawPassword);

            expect(result).toBeNull();
        });
    });
});
