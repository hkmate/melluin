import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {FindOptionConverterModule} from '@be/find-option-converter/find-option-converter.module';
import {DepartmentEntity} from '@be/department/model/department.entity';
import {DepartmentDao} from '@be/department/department.dao';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            DepartmentEntity
        ]),

        FindOptionConverterModule,
    ],
    providers: [
        DepartmentDao,
    ],
    exports: [DepartmentDao]
})
export class DepartmentPersistenceModule {
}
