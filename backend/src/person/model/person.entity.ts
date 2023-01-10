import {Column, Entity, OneToOne, PrimaryColumn} from 'typeorm';
import {UserEntity} from '@be/user/model/user.entity';

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

    @Column()
    email?: string;

    @Column()
    phone?: string;

    @OneToOne(type => UserEntity, (user: UserEntity) => user.person)
    user?: UserEntity;

}
