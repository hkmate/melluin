import {Test} from '@nestjs/testing';
import {AuthService} from '@be/auth/service/auth.service';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';
import {UserDao} from '@be/user/user.dao';
import {PersonDao} from '@be/person/person.dao';
import {DefaultSysAdmin} from '@be/config/model/default-sys-admin';
import {cast, randomString} from '@shared/util/test-util';
import {Role} from '@shared/user/role.enum';
import {PersonEntity} from '@be/person/model/person.entity';
import {UserEntity} from '@be/user/model/user.entity';
import * as crypto from 'crypto';
import {randomUUID} from 'crypto';
import {User} from '@shared/user/user';
import {AuthToken} from '@shared/user/auth-token';
import {when} from 'jest-when';
import {Nullable} from '@shared/util/util';
import {PasswordCryptService} from '@be/user/service/password-crypt.service';
import {UserEntityToDtoModule} from '@be/user/user-entity-to-dto.module';
import Mock = jest.Mock;
import {UnauthorizedException} from '@nestjs/common';

describe('AuthService', () => {
    describe('Construct when default user not needed', () => {
        let userService: UserDao;
        let personService: PersonDao;

        beforeEach(async () => {
            const configServiceGet = jest.fn().mockImplementation((paramName: string) => {
                if (paramName === 'server.defaultSysAdmin.needToInit') {
                    return false;
                }
                return null;
            });

            const moduleRef = await Test.createTestingModule({
                imports: [
                    UserEntityToDtoModule
                ],
                providers: [
                    AuthService,
                    {provide: ConfigService, useValue: {get: configServiceGet}},
                    {provide: JwtService, useValue: {}},
                    {provide: UserDao, useValue: {save: jest.fn(), findAllRole: jest.fn()}},
                    {provide: PersonDao, useValue: {save: jest.fn()}},
                    {provide: PasswordCryptService, useValue: {}},
                ],
            }).compile();

            userService = moduleRef.get<UserDao>(UserDao);
            personService = moduleRef.get<PersonDao>(PersonDao);
        });

        it('Then Person-, UserService not called', () => {
            expect(userService.findAllRole).not.toBeCalled();
            expect(userService.save).not.toBeCalled();
            expect(personService.save).not.toBeCalled();
        });
    });

    describe('Construct when default user needed and not present', () => {
        let userService: UserDao;
        let personService: PersonDao;
        const defaultUser: DefaultSysAdmin = {
            firstName: randomString(),
            lastName: randomString(),
            password: randomString(),
            username: randomString(),
            needToInit: true
        };
        const mockedPersonId = 'c3121569-ccb8-4600-b07b-3f59b4a477fa';
        const mockedUserId = 'c0b74770-5be3-4d44-84c8-596f244488c9';
        const expectedRoles = [{id: randomString(), role: Role.SYSADMIN, permissions: []}];
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
                .mockReturnValueOnce(mockedPersonId)
                .mockReturnValueOnce(mockedUserId);

            const passwordCryptServiceEncrypt = jest.fn(pass => {
                if (pass === defaultUser.password) {
                    return expectedPassword;
                }
                return null;
            });
            const userServiceFindAllRole = jest.fn(() => expectedRoles);

            const moduleRef = await Test.createTestingModule({
                imports: [
                    UserEntityToDtoModule
                ],
                providers: [
                    AuthService,
                    {provide: ConfigService, useValue: {get: configServiceGet}},
                    {provide: JwtService, useValue: {}},
                    {
                        provide: UserDao, useValue: {
                            findOneByName: jest.fn().mockReturnValueOnce(null),
                            save: jest.fn(arg => arg),
                            findAllRole: userServiceFindAllRole
                        }
                    },
                    {provide: PersonDao, useValue: {save: jest.fn(arg => arg),}},
                    {provide: PasswordCryptService, useValue: {encrypt: passwordCryptServiceEncrypt}},
                ],
            }).compile();

            userService = moduleRef.get<UserDao>(UserDao);
            personService = moduleRef.get<PersonDao>(PersonDao);
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

            expect(userService.findOneByName).toBeCalledWith(defaultUser.username);
            expect(userService.findAllRole).toBeCalled();
            expect(personService.save).toBeCalledWith(expectedPerson);
            expect(userService.save).toBeCalledWith(expectedUser);
        });
    });

    describe('Construct when default user needed and present', () => {
        let userService: UserDao;
        let personService: PersonDao;
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
                imports: [
                    UserEntityToDtoModule
                ],
                providers: [
                    AuthService,
                    {provide: ConfigService, useValue: {get: configServiceGet}},
                    {provide: JwtService, useValue: {}},
                    {
                        provide: UserDao, useValue: {
                            findOneByName: jest.fn().mockReturnValueOnce({username: defaultUser.username}),
                            save: jest.fn(),
                            findAllRole: jest.fn()
                        }
                    },
                    {provide: PersonDao, useValue: {save: jest.fn()}},
                    {provide: PasswordCryptService, useValue: {encrypt: jest.fn()}},
                ],
            }).compile();

            userService = moduleRef.get<UserDao>(UserDao);
            personService = moduleRef.get<PersonDao>(PersonDao);
        });

        it('Then Person-, UserService not called except UserService.findOne', () => {
            expect(userService.findOneByName).toBeCalledWith(defaultUser.username);
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
                imports: [
                    UserEntityToDtoModule
                ],
                providers: [
                    AuthService,
                    {provide: ConfigService, useValue: {get: jest.fn(() => false)}},
                    {provide: JwtService, useValue: {sign: jest.fn()}},
                    {provide: UserDao, useValue: {}},
                    {provide: PersonDao, useValue: {}},
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
                personId: randomUUID(),
                userName: randomString(),
                roles: [Role.SYSADMIN],
                permissions: [],
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
        let userService: UserDao;
        let passwordCryptService: PasswordCryptService;

        beforeEach(async () => {
            const moduleRef = await Test.createTestingModule({
                imports: [
                    UserEntityToDtoModule
                ],
                providers: [
                    {provide: ConfigService, useValue: {get: jest.fn(() => false)}},
                    {provide: JwtService, useValue: {sign: jest.fn()}},
                    {provide: UserDao, useValue: {findOneByName: jest.fn()}},
                    {provide: PersonDao, useValue: {}},
                    {provide: PasswordCryptService, useValue: {match: jest.fn()}},
                    AuthService,
                ],
            }).compile();

            authService = moduleRef.get<AuthService>(AuthService);
            userService = moduleRef.get<UserDao>(UserDao);
            passwordCryptService = moduleRef.get<PasswordCryptService>(PasswordCryptService);
        });

        it('When user is in db and active and password is correct Then user object returned without password', async () => {
            const userId: string = randomUUID();
            const personId: string = randomUUID();
            const userName: string = randomString();
            const password: string = randomString();
            const userEntity: UserEntity = {
                userName, password,
                id: userId,
                person: cast<PersonEntity>({id: personId}),
                isActive: true,
                roles: [{id: randomUUID(), role: Role.SYSADMIN, permissions: []}]
            };
            const expectedUser: User = {
                id: userId,
                personId,
                userName,
                permissions: [],
                roles: [Role.SYSADMIN],
                isActive: true
            }
            const rawPassword: string = randomString();
            when(userService.findOneByName).calledWith(userName).mockReturnValue(Promise.resolve(userEntity));
            when(passwordCryptService.match).calledWith(rawPassword, password).mockReturnValue(true);

            const result: Nullable<User> = await authService.validateUser(userName, rawPassword);

            expect(result).toEqual(expectedUser);
        });

        it('When user is in db and active and password is not correct Then null returned', async () => {
            const userId: string = randomUUID();
            const personId: string = randomUUID();
            const userName: string = randomString();
            const password: string = randomString();
            const userEntity: UserEntity = {
                userName, password,
                id: userId,
                person: cast<PersonEntity>({id: personId}),
                isActive: true,
                roles: [{id: randomUUID(), role: Role.SYSADMIN, permissions: []}]
            };
            const rawPassword: string = randomString();
            when(userService.findOneByName).calledWith(userName).mockReturnValue(Promise.resolve(userEntity));
            when(passwordCryptService.match).calledWith(rawPassword, password).mockReturnValue(false);

            const testValidate = (): Promise<User> => authService.validateUser(userName, rawPassword);

            await expect(testValidate).rejects.toThrow(UnauthorizedException);
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
                roles: [{id: randomUUID(), role: Role.SYSADMIN, permissions: []}]
            };
            const rawPassword: string = randomString();
            when(userService.findOneByName).calledWith(userName).mockReturnValue(Promise.resolve(userEntity));

            const testValidate = (): Promise<User> => authService.validateUser(userName, rawPassword);

            await expect(testValidate).rejects.toThrow(UnauthorizedException);
        });

        it('When user is not in db Then null returned', async () => {
            const userName: string = randomString();
            const rawPassword: string = randomString();
            when(userService.findOneByName).calledWith(userName).mockReturnValue(Promise.resolve(null));

            const testValidate = (): Promise<User> => authService.validateUser(userName, rawPassword);

            await expect(testValidate).rejects.toThrow(UnauthorizedException);
        });
    });
});
