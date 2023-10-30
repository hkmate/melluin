import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryColumn} from 'typeorm';
import {RoleEntity} from './role.entity';
import {PersonEntity} from '../../person/model/person.entity';
import {UserSettings} from '@shared/user/user';

@Entity({name: 'user'})
export class UserEntity {

    @PrimaryColumn('uuid')
    id: string;

    @Column({name: 'username'})
    userName: string;

    @Column()
    password: string;

    @Column({name: 'is_active'})
    isActive: boolean;

    @Column({name: 'custom_info', type: 'jsonb'})
    settings?: UserSettings;

    @OneToOne(type => PersonEntity, {eager: true, cascade: ['insert', 'update']})
    @JoinColumn({name: 'person_id'})
    person: PersonEntity;

    @ManyToMany(type => RoleEntity, {eager: true})
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
    roles: Array<RoleEntity>;

}
