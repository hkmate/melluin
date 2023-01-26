import {AsyncValidator} from '@shared/validator/validator';
import {UserCreation} from '@shared/user/user-creation';
import {isNotNil} from '@shared/util/util';
import {ConflictException, Injectable} from '@nestjs/common';
import {UserDao} from '@be/user/user.dao';

@Injectable()
export class UsernameIsNotUsedValidator implements AsyncValidator<UserCreation> {

    constructor(private readonly userDao: UserDao) {
    }

    public async validate(newUser: UserCreation): Promise<void> {
        const user = await this.userDao.findOneByName(newUser.userName);
        if (isNotNil(user)) {
            throw new ConflictException(
                `Username is used already (username: ${newUser.userName})`);
        }
    }

}
