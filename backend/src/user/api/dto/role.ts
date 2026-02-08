import {Permission} from '@shared/user/permission.enum';
import {IsEnum, IsString, IsUUID} from 'class-validator';
import {Role, RoleCreation, RoleType} from '@shared/user/role';


export class RoleEditValidatedInput implements Role {

    @IsString()
    name: string;

    @IsEnum(RoleType)
    type: RoleType;

    @IsString()
    @IsUUID()
    id: string;

    @IsEnum(Permission, {each: true})
    permissions: Array<Permission>;

}

export class RoleCreationValidatedInput implements RoleCreation {

    @IsString()
    name: string;

    @IsEnum(RoleType)
    type: RoleType;

    @IsEnum(Permission, {each: true})
    permissions: Array<Permission>;

}

