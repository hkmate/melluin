import {AuthCredentials} from '@shared/user/auth-credentials';
import {IsString} from 'class-validator';

export class AuthCredentialsValidatedInput implements AuthCredentials {

    @IsString()
    username: string;

    @IsString()
    password: string;

}
