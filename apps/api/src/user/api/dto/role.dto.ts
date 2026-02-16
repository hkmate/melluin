import {Permission, Role, RoleCreation, RoleType} from '@melluin/common';
import {ApiProperty} from '@nestjs/swagger';
import {IsEnum, IsString, IsUUID} from 'class-validator';


export class RoleEditDto implements Role {

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty({enum: RoleType, enumName: 'RoleType'})
    @IsEnum(RoleType)
    type: RoleType;

    @ApiProperty()
    @IsString()
    @IsUUID()
    id: string;

    @ApiProperty({enum: Permission, isArray: true})
    @IsEnum(Permission, {each: true})
    permissions: Array<Permission>;

}

export class RoleCreationDto implements RoleCreation {

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty({enum: RoleType, enumName: 'RoleType'})
    @IsEnum(RoleType)
    type: RoleType;

    @ApiProperty({enum: Permission, isArray: true})
    @IsEnum(Permission, {each: true})
    permissions: Array<Permission>;

}

