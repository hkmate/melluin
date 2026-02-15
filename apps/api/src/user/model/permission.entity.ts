import {Column, Entity, PrimaryColumn} from 'typeorm';
import {Permission} from '@melluin/common';

@Entity({name: 'permission'})
export class PermissionEntity {

    @PrimaryColumn('uuid')
    id: string

    @Column()
    permission: Permission;

    public static raw(entity: PermissionEntity): Permission {
        return entity.permission;
    }

}
