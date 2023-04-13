import {Person} from '@shared/person/person';
import {Injectable} from '@nestjs/common';
import {isNil} from '@shared/util/util';
import {Converter} from '@shared/converter';
import {User} from '@shared/user/user';
import {foundationWorkerRoles} from '@shared/user/role.enum';

@Injectable()
export class HidePersonSensitiveDataConverter implements Converter<Person, Person> {

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
        if (this.isUserJustVolunteer()) {
            return this.handlePhone(
                this.handleEmail(person));
        }

        return person;
    }

    private isUserJustVolunteer(): boolean {
        return !this.currentUser.roles.some(role => foundationWorkerRoles.includes(role));
    }

    private handlePhone(person: Person): Person {
        if (person?.preferences?.canVolunteerSeeMyPhone) {
            return person;
        }
        delete person.phone;
        return person;
    }

    private handleEmail(person: Person): Person {
        if (person?.preferences?.canVolunteerSeeMyEmail) {
            return person;
        }
        delete person.email;
        return person;
    }

}
