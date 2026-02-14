import {DefaultSysAdmin} from '@be/config/model/default-sys-admin';
import {Security} from '@be/config/model/security';

export interface Server {
    port: number;
    defaultSysAdmin: DefaultSysAdmin;
    security: Security;
}
