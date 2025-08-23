import { Test } from '@nestjs/testing';
import { AuthService } from '@be/auth/service/auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserDao } from '@be/user/user.dao';
import { PersonDao } from '@be/person/person.dao';
import { DefaultSysAdmin } from '@be/config/model/default-sys-admin';
import { cast, randomString } from '@shared/util/test-util';
import { PersonEntity } from '@be/person/model/person.entity';
import { UserEntity } from '@be/user/model/user.entity';
import * as crypto from 'crypto';
import { randomUUID } from 'crypto';
import { User } from '@shared/user/user';
import { AuthInfo } from '@shared/user/auth-info';
import { when } from 'jest-when';
import { PasswordCryptService } from '@be/user/service/password-crypt.service';
import { UserEntityToDtoModule } from '@be/user/user-entity-to-dto.module';
import { BadRequestException } from '@nestjs/common';
import { RoleDao } from '@be/user/role.dao';
import { RoleBrief, RoleType } from '@shared/user/role';
import * as Utils from '@be/util/util';
import Mock = jest.Mock;

describe('AuthService', () => {
    describe('Construct when default user not needed', () => {
        let userService: UserDao;
        let roleDao: RoleDao;
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
                    UserEntityToDtoModule,
                ],
                providers: [
                    AuthService,
                    { provide: ConfigService, useValue: { get: configServiceGet } },
                    { provide: JwtService, useValue: {} },
                    { provide: UserDao, useValue: { save: jest.fn() } },
                    { provide: RoleDao, useValue: { findAll: jest.fn() } },
                    { provide: PersonDao, useValue: { save: jest.fn() } },
                    { provide: PasswordCryptService, useValue: {} },
                ],
            }).compile();

            userService = moduleRef.get<UserDao>(UserDao);
            roleDao = moduleRef.get<RoleDao>(RoleDao);
            personService = moduleRef.get<PersonDao>(PersonDao);
        });

        it('Then Person-, UserService not called', () => {
            expect(roleDao.findAll).not.toBeCalled();
            expect(userService.save).not.toBeCalled();
            expect(personService.save).not.toBeCalled();
        });
    });

    describe('Construct when default user needed and not present', () => {
        let userService: UserDao;
        let roleDao: RoleDao;
        let personService: PersonDao;
        const defaultUser: DefaultSysAdmin = {
            firstName: randomString(),
            lastName: randomString(),
            password: randomString(),
            username: randomString(),
            needToInit: true,
        };
        const mockedPersonId = 'c3121569-ccb8-4600-b07b-3f59b4a477fa';
        const mockedUserId = 'c0b74770-5be3-4d44-84c8-596f244488c9';
        const expectedRoles = [{ id: randomString(), name: 'role1', type: RoleType.SYSADMIN, permissions: [] }];
        const expectedPassword = randomString();
        const mockedDate = new Date();

        beforeEach(async () => {
            jest.spyOn(Utils, 'now').mockReturnValue(mockedDate);

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
                    UserEntityToDtoModule,
                ],
                providers: [
                    AuthService,
                    { provide: ConfigService, useValue: { get: configServiceGet } },
                    { provide: JwtService, useValue: {} },
                    {
                        provide: UserDao, useValue: {
                            findOneByName: jest.fn().mockReturnValueOnce(undefined),
                            save: jest.fn(arg => arg),
                        },
                    },
                    { provide: RoleDao, useValue: { findAll: userServiceFindAllRole } },
                    { provide: PersonDao, useValue: { save: jest.fn(arg => arg) } },
                    { provide: PasswordCryptService, useValue: { encrypt: passwordCryptServiceEncrypt } },
                ],
            }).compile();

            userService = moduleRef.get<UserDao>(UserDao);
            roleDao = moduleRef.get<RoleDao>(RoleDao);
            personService = moduleRef.get<PersonDao>(PersonDao);
        });

        it('Then Person-, UserService called with filled objects', () => {
            const expectedPerson: PersonEntity = {
                id: mockedPersonId,
                firstName: defaultUser.firstName,
                lastName: defaultUser.lastName,
                email: null,
                phone: null,
                user: null,
                preferences: null,
                created: mockedDate,
                createdByPersonId: null,
            };
            const expectedUser: UserEntity = {
                id: mockedUserId,
                roles: expectedRoles,
                person: expectedPerson,
                userName: defaultUser.username,
                password: expectedPassword,
                customPermissions: [],
                isActive: true,
                lastLogin: null,
                created: mockedDate,
                createdByPersonId: null,
            };

            expect(userService.findOneByName).toBeCalledWith(defaultUser.username);
            expect(roleDao.findAll).toBeCalled();
            expect(personService.save).toBeCalledWith(expectedPerson);
            expect(userService.save).toBeCalledWith(expectedUser);
        });
    });

    describe('Construct when default user needed and present', () => {
        let userService: UserDao;
        let roleDao: RoleDao;
        let personService: PersonDao;
        const defaultUser: DefaultSysAdmin = {
            firstName: randomString(),
            lastName: randomString(),
            password: randomString(),
            username: randomString(),
            needToInit: true,
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
                    UserEntityToDtoModule,
                ],
                providers: [
                    AuthService,
                    { provide: ConfigService, useValue: { get: configServiceGet } },
                    { provide: JwtService, useValue: {} },
                    {
                        provide: UserDao, useValue: {
                            findOneByName: jest.fn().mockReturnValueOnce({ username: defaultUser.username }),
                            save: jest.fn(),
                        },
                    },
                    { provide: RoleDao, useValue: { findAll: jest.fn() } },
                    { provide: PersonDao, useValue: { save: jest.fn() } },
                    { provide: PasswordCryptService, useValue: { encrypt: jest.fn() } },
                ],
            }).compile();

            userService = moduleRef.get<UserDao>(UserDao);
            roleDao = moduleRef.get<RoleDao>(RoleDao);
            personService = moduleRef.get<PersonDao>(PersonDao);
        });

        it('Then Person-, UserService not called except UserService.findOne', () => {
            expect(userService.findOneByName).toBeCalledWith(defaultUser.username);
            expect(roleDao.findAll).not.toBeCalled();
            expect(personService.save).not.toBeCalled();
            expect(userService.save).not.toBeCalled();
        });
    });

    describe('getTokenFor', () => {
        let authService: AuthService;
        let jwtService: JwtService;
        let userDao: UserDao;
        let configService: ConfigService;

        beforeEach(async () => {
            const moduleRef = await Test.createTestingModule({
                imports: [
                    UserEntityToDtoModule,
                ],
                providers: [
                    AuthService,
                    { provide: ConfigService, useValue: { get: jest.fn(() => false) } },
                    { provide: JwtService, useValue: { sign: jest.fn() } },
                    { provide: UserDao, useValue: { findOneWithCache: jest.fn(), save: jest.fn() } },
                    { provide: RoleDao, useValue: {} },
                    { provide: PersonDao, useValue: {} },
                    { provide: PasswordCryptService, useValue: {} },
                ],
            }).compile();

            authService = moduleRef.get<AuthService>(AuthService);
            jwtService = moduleRef.get<JwtService>(JwtService);
            userDao = moduleRef.get<UserDao>(UserDao);
            configService = moduleRef.get<ConfigService>(ConfigService);
        });

        it('When user is valid Then token returned with wrapped user', async () => {
            const mockedDate = new Date();
            jest.spyOn(Utils, 'now').mockReturnValue(mockedDate);
            const userId: string = randomUUID();
            const personId: string = randomUUID();
            const username: string = randomString();
            const password: string = randomString();
            const user: User = {
                id: userId,
                personId,
                userName: username,
                roles: [cast<RoleBrief>({ name: 'role1', type: RoleType.SYSADMIN })],
                lastLogin: mockedDate.toISOString(),
                permissions: [],
                customPermissions: [],
                isActive: true,
            };
            const userEntity: UserEntity = {
                userName: username,
                password,
                id: userId,
                isActive: user.isActive,
                customPermissions: [],
                person: cast<PersonEntity>({ id: personId }),
                roles: [{ id: randomUUID(), name: 'role1', type: RoleType.SYSADMIN, permissions: [] }],
                settings: { eventList: {} },
                lastLogin: null,
                created: null,
                createdByPersonId: null,
            };
            const expectedRefreshedUser: UserEntity = {
                ...userEntity,
                lastLogin: mockedDate,
            };
            const expectedTokenStr = `&@${JSON.stringify(user)}@&`;
            const expectedToken: AuthInfo = { accessToken: expectedTokenStr, user, userSettings: userEntity.settings! };
            (jwtService.sign as Mock).mockReturnValueOnce(expectedTokenStr);
            (userDao.findOneWithCache as Mock).mockReturnValueOnce(userEntity);
            (userDao.save as Mock).mockImplementation(x => x);

            const result: AuthInfo = await authService.getTokenFor({ username, password });

            expect(result).toEqual(expectedToken);
            expect(jwtService.sign).toBeCalledWith({ userId: user.id });
            expect(userDao.findOneWithCache).toBeCalledWith(username);
            expect(userDao.save).toBeCalledWith(expectedRefreshedUser);
            expect(configService.get).toBeCalledWith('server.defaultSysAdmin.needToInit', false);
        });
    });


    describe('validate', () => {
        let authService: AuthService;
        let userService: UserDao;
        let passwordCryptService: PasswordCryptService;

        beforeEach(async () => {
            const moduleRef = await Test.createTestingModule({
                imports: [
                    UserEntityToDtoModule,
                ],
                providers: [
                    { provide: ConfigService, useValue: { get: jest.fn(() => false) } },
                    { provide: JwtService, useValue: { sign: jest.fn() } },
                    { provide: UserDao, useValue: { findOneWithCache: jest.fn() } },
                    { provide: RoleDao, useValue: {} },
                    { provide: PersonDao, useValue: {} },
                    { provide: PasswordCryptService, useValue: { match: jest.fn() } },
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
                person: cast<PersonEntity>({ id: personId }),
                isActive: true,
                customPermissions: [],
                lastLogin: null,
                created: null,
                createdByPersonId: null,
                roles: [{ id: randomUUID(), name: 'role1', type: RoleType.SYSADMIN, permissions: [] }],
            };
            const rawPassword: string = randomString();
            when(userService.findOneWithCache).calledWith(userName).mockReturnValue(Promise.resolve(userEntity));
            when(passwordCryptService.match).calledWith(rawPassword, password).mockReturnValue(true);

            await authService.validate({ username: userName, password: rawPassword });

            // Note: no expect needed, the validation successful when it returns (not throws error).
        });

        it('When user is in db and active and password is not correct Then null returned', async () => {
            const userId: string = randomUUID();
            const personId: string = randomUUID();
            const userName: string = randomString();
            const password: string = randomString();
            const userEntity: UserEntity = {
                userName, password,
                id: userId,
                person: cast<PersonEntity>({ id: personId }),
                isActive: true,
                customPermissions: [],
                lastLogin: null,
                created: null,
                createdByPersonId: null,
                roles: [{ id: randomUUID(), name: 'role1', type: RoleType.SYSADMIN, permissions: [] }],
            };
            const rawPassword: string = randomString();
            when(userService.findOneWithCache).calledWith(userName).mockReturnValue(Promise.resolve(userEntity));
            when(passwordCryptService.match).calledWith(rawPassword, password).mockReturnValue(false);

            const testValidate = (): Promise<void> => authService.validate({
                username: userName,
                password: rawPassword,
            });

            await expect(testValidate).rejects.toThrow(BadRequestException);
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
                lastLogin: null,
                created: null,
                createdByPersonId: null,
                customPermissions: [],
                roles: [{ id: randomUUID(), name: 'role1', type: RoleType.SYSADMIN, permissions: [] }],
            };
            const rawPassword: string = randomString();
            when(userService.findOneWithCache).calledWith(userName).mockReturnValue(Promise.resolve(userEntity));

            const testValidate = (): Promise<void> => authService.validate({
                username: userName,
                password: rawPassword,
            });

            await expect(testValidate).rejects.toThrow(BadRequestException);
        });

        it('When user is not in db Then null returned', async () => {
            const userName: string = randomString();
            const rawPassword: string = randomString();
            when(userService.findOneWithCache).calledWith(userName).mockReturnValue(Promise.resolve(undefined));

            const testValidate = (): Promise<void> => authService.validate({
                username: userName,
                password: rawPassword,
            });

            await expect(testValidate).rejects.toThrow(BadRequestException);
        });
    });
});
