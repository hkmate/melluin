import {Column, Entity, PrimaryColumn} from 'typeorm';
import {PermissionT, UUID} from '@melluin/common';

@Entity({name: 'permission'})
export class PermissionEntity {

    @PrimaryColumn('uuid')
    id: UUID

    @Column()
    permission: PermissionT;

    public static raw(entity: PermissionEntity): PermissionT {
        return entity.permission;
    }

}
