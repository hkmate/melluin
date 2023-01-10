import {Global, Module} from '@nestjs/common';
import {WhereClosureConverter} from '@be/find-option-converter/where-closure.converter';
import {WhereClosureOperationConvertFactory} from '@be/find-option-converter/where-closure-operation-convert.factory';

@Global()
@Module({
    providers: [
        WhereClosureConverter,
        WhereClosureOperationConvertFactory
    ],
    exports: [
        WhereClosureConverter,
        WhereClosureOperationConvertFactory
    ]
})
export class FindOptionConverterModule {

}
