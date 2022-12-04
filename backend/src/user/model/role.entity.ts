import {Column, Entity, PrimaryColumn} from 'typeorm';
import {Role} from '@shared/user/role.enum';

@Entity({name: 'role'})
export class RoleEntity {

    @PrimaryColumn('uuid')
    id!: string

    @Column()
    role!: Role;

}
