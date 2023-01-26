import {Injectable} from '@nestjs/common';
import {UserDao} from '@be/user/user.dao';
import {User} from '@shared/user/user';
import {UserCreation} from '@shared/user/user-creation';
import {UserCreationToEntityConverter} from '@be/user/converter/user-creation-to-entity.converter';
import {UserEntityToDtoConverter} from '@be/user/converter/user-entity-to-dto.converter';
import {RequesterHasPermissionToAddUserValidator} from '@be/user/validator/requester-has-permission-to-add-user.validator';
import {UserUpdate} from '@shared/user/user-update';
import {PersonHasNoUserYetValidator} from '@be/user/validator/person-has-no-user-yet.validator';
import {UsernameIsNotUsedValidator} from '@be/user/validator/username-is-not-used.validator';
import {AsyncValidatorChain} from '@shared/validator/validator-chain';
import {RequesterHasPermissionToChangeUserValidator} from '@be/user/validator/requester-has-permission-to-change-user.validator';
import {UserEntity} from '@be/user/model/user.entity';
import {isNotNil} from '@shared/util/util';
import {PasswordCryptService} from '@be/user/service/password-crypt.service';

@Injectable()
export class UserService {

    constructor(private readonly userDao: UserDao,
                private readonly passwordEncoder: PasswordCryptService,
                private readonly personHasNoUserYetValidator: PersonHasNoUserYetValidator,
                private readonly usernameIsNotUsedValidator: UsernameIsNotUsedValidator,
                private readonly userConverter: UserEntityToDtoConverter,
                private readonly userCreationConverter: UserCreationToEntityConverter) {
    }

    public async save(userCreation: UserCreation, requester: User): Promise<User> {
        await this.validateSaving(userCreation, requester);
        const creationEntity = await this.userCreationConverter.convert(userCreation);
        const personEntity = await this.userDao.save(creationEntity);
        return this.userConverter.convert(personEntity);
    }

    public async update(userId: string, changeSet: UserUpdate, requester: User): Promise<User> {
        const entity = await this.userDao.getOne(userId);
        RequesterHasPermissionToChangeUserValidator
            .of(requester)
            .validate({entity, changeSet});

        this.applyChangesToEntity(entity, changeSet);
        const savedEntity = await this.userDao.save(entity);
        return this.userConverter.convert(savedEntity);
    }

    private applyChangesToEntity(entity: UserEntity, changeSet: UserUpdate): void {
        if (isNotNil(changeSet.password)) {
            entity.password = this.passwordEncoder.encrypt(changeSet.password)
        }
        if (isNotNil(changeSet.isActive)) {
            entity.isActive = changeSet.isActive;
        }
    }

    private async validateSaving(userCreation: UserCreation, requester: User): Promise<void> {
        RequesterHasPermissionToAddUserValidator
            .of(requester)
            .validate(userCreation);
        await AsyncValidatorChain.of(
            this.personHasNoUserYetValidator,
            this.usernameIsNotUsedValidator
        ).validate(userCreation);
    }

}
