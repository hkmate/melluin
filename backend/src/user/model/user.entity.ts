import {Column, Entity, ManyToMany, PrimaryColumn, JoinTable, OneToOne, JoinColumn} from 'typeorm';
import {RoleEntity} from './role.entity';
import {PersonEntity} from '../../person/model/person.entity';

@Entity({name: 'user'})
export class UserEntity {

    @PrimaryColumn('uuid')
    id!: string;

    @Column({name: 'username'})
    userName!: string;

    @Column()
    password!: string;

    @Column({name: 'is_active'})
    isActive!: boolean;

    @OneToOne(type => PersonEntity, {cascade: ['insert', 'update', 'remove']})
    @JoinColumn({name: 'person_id'})
    person!: PersonEntity;

    @ManyToMany(
        type => RoleEntity,
        {cascade: ['insert', 'update', 'remove']}
    )
    @JoinTable({
        name: 'user_role',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'role_id',
            referencedColumnName: 'id'
        }
    })
    roles!: Array<RoleEntity>;

}
