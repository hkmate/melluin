import {IsBoolean, IsOptional, Matches, MinLength} from 'class-validator';
import {passwordMinLength, passwordPattern} from '@shared/constants';

export class UserUpdate {

    @MinLength(passwordMinLength)
    @Matches(passwordPattern)
    @IsOptional()
    password: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

}

