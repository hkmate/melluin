import {Column, Entity, JoinTable, ManyToMany, PrimaryColumn} from 'typeorm';
import {PermissionEntity} from '@be/user/model/permission.entity';
import {RoleType, UUID} from '@melluin/common';

@Entity({name: 'role'})
export class RoleEntity {

    @PrimaryColumn('uuid')
    id: UUID

    @Column()
    name: string;

    @Column()
    type: RoleType;

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
