import {Permission, Role, RoleCreation, RoleType} from '@melluin/common';
import {IsEnum, IsString, IsUUID} from 'class-validator';


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

