import {Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordCryptService {

    private static readonly SALT = 10;

    public encrypt(password: string): Promise<string> {
        return bcrypt.hash(password, PasswordCryptService.SALT);
    }

    public match(password: string, hashedPassword): boolean {
        return bcrypt.compareSync(password, hashedPassword);
    }
}