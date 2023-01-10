import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {PersonEntity} from './model/person.entity';
import {PersonDao} from 'src/person/person.dao';
import {FindOptionConverterModule} from '@be/find-option-converter/find-option-converter.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PersonEntity
        ]),

        FindOptionConverterModule,
    ],
    controllers: [],
    providers: [PersonDao],
    exports: [PersonDao]
})
export class PersonModule {
}
