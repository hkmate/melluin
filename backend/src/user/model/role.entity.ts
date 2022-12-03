import {Column, Entity, PrimaryColumn} from 'typeorm';
import {Role} from '../../auth/constant/role.enum';

@Entity({name: 'role'})
export class RoleEntity {

    @PrimaryColumn('uuid')
    id!: string

    @Column()
    role!: Role;

}
