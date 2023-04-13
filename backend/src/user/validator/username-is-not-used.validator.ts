import {AsyncValidator} from '@shared/validator/validator';
import {UserCreation} from '@shared/user/user-creation';
import {isNotNil} from '@shared/util/util';
import {ConflictException, Injectable} from '@nestjs/common';
import {UserDao} from '@be/user/user.dao';
import {UserRewriteWithEntity} from '@be/user/validator/user-rewrite.validator';

@Injectable()
export class UsernameIsNotUsedValidator implements AsyncValidator<UserCreation | UserRewriteWithEntity> {

    constructor(private readonly userDao: UserDao) {
    }

    public async validate(userInput: UserCreation | UserRewriteWithEntity): Promise<void> {
        const userName = this.getUserName(userInput);
        const user = await this.userDao.findOneByName(userName);
        if (isNotNil(user)) {
            throw new ConflictException(
                `Username is used already (username: ${userName})`);
        }
    }

    private getUserName(userInput: UserCreation | UserRewriteWithEntity): string {
        if ('userName' in userInput) {
            return userInput.userName;
        }
        return userInput.rewrite.userName;
    }

}
