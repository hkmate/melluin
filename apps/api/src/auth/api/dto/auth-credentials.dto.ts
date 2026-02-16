import {IsString} from 'class-validator';
import {AuthCredentials} from '@melluin/common';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDto implements AuthCredentials {

    @ApiProperty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsString()
    password: string;

}
