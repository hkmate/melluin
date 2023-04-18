import {Column, Entity, OneToOne, PrimaryColumn} from 'typeorm';
import {UserEntity} from '@be/user/model/user.entity';
import {PersonPreferences} from '@shared/person/person';
import {plainToInstance} from 'class-transformer';

@Entity({name: 'person'})
export class PersonEntity {

    @PrimaryColumn('uuid')
    id!: string;

    @Column({name: 'first_name'})
    firstName!: string;

    @Column({name: 'last_name'})
    lastName!: string;

    @Column({name: 'nick_name'})
    nickName?: string;

    @Column({type: 'jsonb', transformer: {
            to: value => value,
            from: value => plainToInstance(PersonPreferences, value)
        }})
    preferences?: PersonPreferences;

    @Column()
    email?: string;

    @Column()
    phone?: string;

    @OneToOne(type => UserEntity, (user: UserEntity) => user.person)
    user?: UserEntity;

}
