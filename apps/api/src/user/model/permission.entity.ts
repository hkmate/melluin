import {Column, Entity, PrimaryColumn} from 'typeorm';
import {Permission} from '@shared/user/permission.enum';

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
