import {AsyncValidator, isNotNil, UserCreation} from '@melluin/common';
import {PersonDao} from '@be/person/person.dao';
import {ConflictException, Injectable} from '@nestjs/common';

@Injectable()
export class PersonHasNoUserYetValidator implements AsyncValidator<UserCreation> {

    constructor(private readonly personDao: PersonDao) {
    }

    public async validate(newUser: UserCreation): Promise<void> {
        const person = await this.personDao.findOneWithCache(newUser.personId);
        if (isNotNil(person?.user)) {
            throw new ConflictException(
                `There is a user for the specified person (id: ${newUser.personId})`);
        }
    }

}
