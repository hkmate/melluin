import {Column, Entity, OneToOne, PrimaryColumn} from 'typeorm';
import {UserEntity} from '@be/user/model/user.entity';
import {plainToInstance} from 'class-transformer';
import {OperationCity} from '@shared/person/operation-city';
import {PersonPreferences} from '@shared/person/person-preferences';
import {PersonPreferencesDo} from '@be/person/model/person-preferences.do';

@Entity({ name: 'person' })
export class PersonEntity {

    @PrimaryColumn('uuid')
    id: string;

    @Column({ name: 'first_name' })
    firstName: string;

    @Column({ name: 'last_name' })
    lastName: string;

    @Column({
        type: 'jsonb', transformer: {
            to: value => value,
            from: value => plainToInstance(PersonPreferencesDo, value),
        },
        nullable: true,
    })
    preferences: PersonPreferences | null;

    @Column({ type: 'text', nullable: true })
    email: string | null;

    @Column({ type: 'text', nullable: true })
    phone: string | null;

    @Column({ name: 'created', type: 'timestamp', nullable: true })
    created: Date | null;

    @Column({ name: 'created_by', type: 'uuid', nullable: true })
    createdByPersonId: string | null;

    @Column({type: 'jsonb'})
    cities: Array<OperationCity>;

    @OneToOne(type => UserEntity, (user: UserEntity) => user.person, { nullable: true })
    user: UserEntity | null;

}
