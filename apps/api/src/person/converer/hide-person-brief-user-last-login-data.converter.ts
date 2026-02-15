import {Converter, isNil, Permission, Person, User} from '@melluin/common';

export class HidePersonBriefUserLastLoginDataConverter implements Converter<Person, Person> {

    constructor(private readonly currentUser: User) {
    }

    public convert(value: Person): Person;
    public convert(value: undefined): undefined;
    public convert(value?: Person): Person | undefined;
    public convert(value?: Person): Person | undefined {
        if (isNil(value)) {
            return undefined;
        }
        return this.convertNotNil(value);
    }

    private convertNotNil(person: Person): Person {
        if (this.isUserHasSamePersonAsTheOneToConvert(person)) {
            return person;
        }
        if (this.isUserHasReadPermission()) {
            return person;
        }

        return this.hideLastLoginData(person);
    }

    private isUserHasSamePersonAsTheOneToConvert(person: Person): boolean {
        return this.currentUser.personId === person.id;
    }

    private isUserHasReadPermission(): boolean {
        return this.currentUser.permissions.includes(Permission.canReadUserLastLoginData);
    }

    private hideLastLoginData(person: Person): Person {
        if (isNil(person.user)) {
            return person
        }

        delete person.user.lastLogin;
        return person;
    }

}
