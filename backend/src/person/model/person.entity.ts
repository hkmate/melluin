import {Column, Entity, PrimaryColumn} from 'typeorm';

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

}
