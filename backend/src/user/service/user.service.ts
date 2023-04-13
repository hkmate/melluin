import {Injectable} from '@nestjs/common';
import {UserDao} from '@be/user/user.dao';
import {User} from '@shared/user/user';
import {UserCreation} from '@shared/user/user-creation';
import {UserCreationToEntityConverter} from '@be/user/converter/user-creation-to-entity.converter';
import {UserEntityToDtoConverter} from '@be/user/converter/user-entity-to-dto.converter';
import {PersonHasNoUserYetValidator} from '@be/user/validator/person-has-no-user-yet.validator';
import {UsernameIsNotUsedValidator} from '@be/user/validator/username-is-not-used.validator';
import {AsyncValidatorChain} from '@shared/validator/validator-chain';
import {CanRequesterChangeUserValidator} from '@be/user/validator/can-requester-change-user.validator';
import {PasswordCryptService} from '@be/user/service/password-crypt.service';
import {UserRewrite} from '@shared/user/user-rewrite';
import {UserRewriteApplierFactory} from '@be/user/applier/user-rewrite-applier.factory';
import {UserRewriteValidator} from '@be/user/validator/user-rewrite.validator';
import {CanRequesterChangeUsersRoleValidator} from '@be/user/validator/can-requester-change-users-role.validator';

@Injectable()
export class UserService {

    constructor(private readonly userDao: UserDao,
                private readonly passwordEncoder: PasswordCryptService,
                private readonly personHasNoUserYetValidator: PersonHasNoUserYetValidator,
                private readonly usernameIsNotUsedValidator: UsernameIsNotUsedValidator,
                private readonly userConverter: UserEntityToDtoConverter,
                private readonly userCreationConverter: UserCreationToEntityConverter,
                private readonly rewriteFactory: UserRewriteApplierFactory) {
    }

    public async save(userCreation: UserCreation, requester: User): Promise<User> {
        await this.validateSaving(userCreation, requester);
        const creationEntity = await this.userCreationConverter.convert(userCreation);
        const userEntity = await this.userDao.save(creationEntity);
        return this.userConverter.convert(userEntity);
    }

    public async get(userId: string, requester: User): Promise<User> {
        const entity = await this.userDao.getOne(userId);
        return this.userConverter.convert(entity);
    }

    public async update(userId: string, userRewrite: UserRewrite, requester: User): Promise<User> {
        const entity = await this.userDao.getOne(userId);
        await this.createRewriteValidators(requester)
            .validate({entity, rewrite: userRewrite});

        await this.rewriteFactory.createFor(userRewrite)
            .applyOn(entity);
        const savedEntity = await this.userDao.save(entity);
        return this.userConverter.convert(savedEntity);
    }

    private async validateSaving(userCreation: UserCreation, requester: User): Promise<void> {
        await AsyncValidatorChain.of(
            this.personHasNoUserYetValidator,
            this.usernameIsNotUsedValidator
        ).validate(userCreation);
    }

    private createRewriteValidators(requester: User): UserRewriteValidator {
        return AsyncValidatorChain.of(
            CanRequesterChangeUserValidator.of(requester),
            CanRequesterChangeUsersRoleValidator.of(requester),
            new UsernameIsNotUsedValidator(this.userDao)
        );
    }

}
