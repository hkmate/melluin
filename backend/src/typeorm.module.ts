import {TypeOrmModule} from '@nestjs/typeorm';
import {UserEntity} from './user/model/user.entity';
import {RoleEntity} from './user/model/role.entity';
import {PersonEntity} from './person/model/person.entity';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {DepartmentEntity} from '@be/department/model/department.entity';
import {DepartmentBoxStatusEntity} from '@be/department-box/model/department-box-status.entity';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {ChildEntity} from '@be/child/model/child.entity';
import {HospitalVisitActivityEntity} from '@be/hospital-visit-activity/model/hospital-visit-activity.entity';
import {PermissionEntity} from '@be/user/model/permission.entity';
import {VisitedChildEntity} from '@be/hospital-visit-children/persistence/model/visited-child.entity';

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
        ssl: configService.get<boolean>('database.ssl'),
        // DO NOT SET IT TRUE. It not just check if the defined entities compatible with the db,
        // but create the schema every launch of the application
        synchronize: false,

        entities: [
            UserEntity,
            RoleEntity,
            PermissionEntity,
            PersonEntity,
            DepartmentEntity,
            DepartmentBoxStatusEntity,
            HospitalVisitEntity,
            VisitedChildEntity,
            HospitalVisitActivityEntity,
            ChildEntity
        ],

        // logging: true
    }),
    inject: [ConfigService],
});
