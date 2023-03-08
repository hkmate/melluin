import {Column, Entity, JoinTable, ManyToMany, PrimaryColumn} from 'typeorm';
import {Role} from '@shared/user/role.enum';
import {PermissionEntity} from '@be/user/model/permission.entity';

@Entity({name: 'role'})
export class RoleEntity {

    @PrimaryColumn('uuid')
    id: string

    @Column()
    role: Role;

    @ManyToMany(
        type => PermissionEntity,
        {eager: true}
    )
    @JoinTable({
        name: 'role_permission',
        joinColumn: {
            name: 'role_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'permission_id',
            referencedColumnName: 'id'
        }
    })
    permissions: Array<PermissionEntity>;

}
