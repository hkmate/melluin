import {Permission, PermissionT, Role, RoleCreation, RoleType, RoleTypes, UUID} from '@melluin/common';
import {ApiProperty} from '@nestjs/swagger';
import {IsEnum, IsString, IsUUID} from 'class-validator';


export class RoleEditDto implements Role {

    @ApiProperty()
    @IsString()
    @IsUUID()
    id: UUID;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty({enum: RoleTypes, enumName: 'RoleType'})
    @IsEnum(RoleTypes)
    type: RoleType;

    @ApiProperty({enum: Permission, isArray: true})
    @IsEnum(Permission, {each: true})
    permissions: Array<PermissionT>;

}

export class RoleCreationDto implements RoleCreation {

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty({enum: RoleTypes, enumName: 'RoleType'})
    @IsEnum(RoleTypes)
    type: RoleType;

    @ApiProperty({enum: Permission, isArray: true})
    @IsEnum(Permission, {each: true})
    permissions: Array<PermissionT>;

}

