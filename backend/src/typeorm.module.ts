import {TypeOrmModule} from '@nestjs/typeorm';
import {UserEntity} from './user/model/user.entity';
import {RoleEntity} from './user/model/role.entity';
import {PersonEntity} from './person/model/person.entity';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {DepartmentEntity} from '@be/department/model/department.entity';

export const TypeOrmModuleDefinition = TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    // eslint-disable-next-line max-lines-per-function
    useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        // DO NOT SET IT TRUE. It not just check if the defined entities compatible with the db,
        // but create the schema every launch of the application
        synchronize: false,

        entities: [
            UserEntity,
            RoleEntity,
            PersonEntity,
            DepartmentEntity,
        ],
    }),
    inject: [ConfigService],
});
