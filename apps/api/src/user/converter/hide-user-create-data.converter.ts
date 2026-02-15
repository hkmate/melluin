import {Converter, isNil, Permission, User} from '@melluin/common';

export class HideUserCreateDataConverter implements Converter<User, User> {

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

        return this.hideCreateData(user);
    }

    private isUserSameAsTheOneToConvert(user: User): boolean {
        return this.currentUser.id === user.id;
    }

    private isUserHasReadPermission(): boolean {
        return this.currentUser.permissions.includes(Permission.canReadUserCreateData);
    }

    private hideCreateData(user: User): User {
        delete user.created;
        delete user.createdByPersonId;
        return user;
    }

}
