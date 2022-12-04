import {TypeOrmModule} from '@nestjs/typeorm';
import * as CONFIG from '@resources/server-config.json';
import {UserEntity} from './user/model/user.entity';
import {RoleEntity} from './user/model/role.entity';
import {PersonEntity} from './person/model/person.entity';

export const TypeOrmModuleDefinition = TypeOrmModule.forRoot({
    type: 'postgres',
    host: CONFIG.database.host,
    port: CONFIG.database.port,
    username: CONFIG.database.username,
    password: CONFIG.database.password,
    database: CONFIG.database.name,
    // DO NOT SET IT TRUE. It not just check if the defined entities compatible with the db,
    // but create the schema every launch of the application
    synchronize: false,

    entities: [
        UserEntity,
        RoleEntity,
        PersonEntity,
    ],
});
