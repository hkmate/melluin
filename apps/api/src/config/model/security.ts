import {JwtModuleOptions} from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';

export interface Security {
    expiration: Required<JwtModuleOptions>['signOptions']['expiresIn'];
    secretKey: string;
}
