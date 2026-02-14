import {Injectable} from '@angular/core';
import {jwtDecode} from 'jwt-decode';

@Injectable()
export class JwtService {

    public decodeToken(token: string): string {
        return jwtDecode(token);
    }

}
