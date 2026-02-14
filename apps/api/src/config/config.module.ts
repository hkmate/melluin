import * as CONFIG from '@resources/server-config.json';
import {ConfigModule} from '@nestjs/config';

export const ConfigModuleDefinition = ConfigModule.forRoot({
    load: [() => CONFIG]
});
