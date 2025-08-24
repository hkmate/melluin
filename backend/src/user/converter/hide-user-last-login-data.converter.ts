import {isNil} from '@shared/util/util';
import {Converter} from '@shared/converter/converter';
import {User} from '@shared/user/user';
import {Permission} from '@shared/user/permission.enum';

export class HideUserLastLoginDataConverter implements Converter<User, User> {

    constructor(private readonly currentUser: User) {
    }

    public convert(value: User): User;
    public convert(value: undefined): undefined;
    public convert(value?: User): User | undefined;
    public convert(value?: User): User | undefined {
        if (isNil(value)) {
            return undefined;
        }
        return this.convertNotNil(value);
    }

    private convertNotNil(user: User): User {
        if (this.isUserSameAsTheOneToConvert(user)) {
            return user;
        }
        if (this.isUserHasReadPermission()) {
            return user;
        }

        return this.hideLastLoginData(user);
    }

    private isUserSameAsTheOneToConvert(user: User): boolean {
        return this.currentUser.id === user.id;
    }

    private isUserHasReadPermission(): boolean {
        return this.currentUser.permissions.includes(Permission.canReadUserLastLoginData);
    }

    private hideLastLoginData(user: User): User {
        delete user.lastLogin;
        return user;
    }

}
