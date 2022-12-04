import {isEmpty, isNotNil} from '@shared/util/util';
import {randomString} from '@shared/util/test-util';
import {PasswordCryptService} from '@be/auth/service/password-crypt.service';

describe('PasswordCryptService', () => {
    const service = new PasswordCryptService();

    describe('encrypt', () => {
        it('When call it with valid string Then result is an other string', () => {
            const password: string = randomString();

            const result: string = service.encrypt(password);

            expect(isNotNil(result)).toBe(true);
            expect(result).not.toEqual(password);
        });

        it('When call it with empty string Then result is a valid string', () => {
            const password = '';

            const result: string = service.encrypt(password);

            expect(isNotNil(result)).toBe(true);
            expect(isEmpty(result)).toBe(false);
        });

        it('When call it with null or undefined Then exception thrown', () => {
            const nullPassword: string = null as unknown as string;
            const undefinedPassword: string = undefined as unknown as string;

            expect(() => service.encrypt(nullPassword)).toThrow();
            expect(() => service.encrypt(undefinedPassword)).toThrow();
        });
    });

    describe('match', () => {
        it('When password is correct to the hash Then true returned', () => {
            const password: string = randomString();
            const hashedPassword: string = service.encrypt(password);

            expect(service.match(password, hashedPassword)).toBe(true);
        });

        it('When password is wrong to the hash Then false returned', () => {
            const password: string = randomString();
            const otherPassword: string = randomString();
            const hashedPassword: string = service.encrypt(password);

            expect(service.match(otherPassword, hashedPassword)).toBe(false);
        });

        it('When password is null Then exception thrown', () => {
            const password: string = randomString();
            const hashedPassword: string = service.encrypt(password);
            const nullPassword: string = null as unknown as string;

            expect(() => service.match(nullPassword, hashedPassword)).toThrow();
        });

        it('When password is undefined Then exception thrown', () => {
            const password: string = randomString();
            const hashedPassword: string = service.encrypt(password);
            const undefinedPassword: string = undefined as unknown as string;

            expect(() => service.match(undefinedPassword, hashedPassword)).toThrow();
        });
    });
});
