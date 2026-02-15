import {IsString} from 'class-validator';
import {AuthCredentials} from '@melluin/common';

export class AuthCredentialsValidatedInput implements AuthCredentials {

    @IsString()
    username: string;

    @IsString()
    password: string;

}
