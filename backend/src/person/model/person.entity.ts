import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '@be/user/model/user.entity';
import { PersonPreferences } from '@shared/person/person';
import { plainToInstance } from 'class-transformer';

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
            from: value => plainToInstance(PersonPreferences, value),
        },
        nullable: true,
    })
    preferences: PersonPreferences | null;

    @Column({ type: 'text', nullable: true })
    email: string | null;

    @Column({ type: 'text', nullable: true })
    phone: string | null;

    @OneToOne(type => UserEntity, (user: UserEntity) => user.person, { nullable: true })
    user: UserEntity | null;

}
