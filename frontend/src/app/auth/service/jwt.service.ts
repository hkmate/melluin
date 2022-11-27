import {Injectable} from '@angular/core';
import jwt_decode from 'jwt-decode';

@Injectable()
export class JwtService {

    public decodeToken(token: string): string {
        return jwt_decode(token);
    }

}
