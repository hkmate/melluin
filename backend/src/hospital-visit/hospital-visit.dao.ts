import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Equal, LessThan, MoreThanOrEqual, Repository} from 'typeorm';
import {Pageable} from '@shared/api-util/pageable';
import {WhereClosureConverter} from '@be/find-option-converter/where-closure.converter';
import {PageCreator} from '@be/crud/page-creator';
import {PageRequest} from '@be/crud/page-request';
import {isNil, toOptional} from '@shared/util/util';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {FilterOptionsFieldsConverter} from '@be/crud/convert/filter-options-fields-converter';
import {FilterOperation, FilterOperationBuilder} from '@shared/api-util/filter-options';
import {FindOptionsWhere} from 'typeorm/find-options/FindOptionsWhere';

interface SameTimeVisitCountParams {
    from: string;
    to: string;
    departmentId: string;
    vicariousMomVisitIncluded: boolean;
}

@Injectable()
export class HospitalVisitDao extends PageCreator<HospitalVisitEntity> {

    private readonly filterFieldConverter: FilterOptionsFieldsConverter;

    constructor(@InjectRepository(HospitalVisitEntity) repository: Repository<HospitalVisitEntity>,
                whereClosureConverter: WhereClosureConverter) {
        super(repository, whereClosureConverter);

        this.filterFieldConverter = FilterOptionsFieldsConverter.of({
            'participants.id': (values: FilterOperation<unknown>) =>
                this.repository.createQueryBuilder('visit')
                    .select('visit.id')
                    .leftJoin('visit.participants', 'participants')
                    .where('participants.id IN (:...ids)', {ids: values.operand})
                    .getMany()
                    .then(entities => entities.map(e => e.id))
                    .then(visitIds => ({key: 'id', value: FilterOperationBuilder.in(visitIds)}))
        });
    }

    public save(department: HospitalVisitEntity): Promise<HospitalVisitEntity> {
        return this.repository.save(department);
    }

    public findOne(id: string): Promise<HospitalVisitEntity | undefined> {
        return this.repository.findOne({
            where: {id},
        }).then(toOptional);
    }

    public getOne(id: string): Promise<HospitalVisitEntity> {
        return this.findOne(id).then(entity => {
            if (isNil(entity)) {
                throw new NotFoundException(`Event not found with id: ${id}`);
            }
            return entity;
        });
    }

    public countForSameTime(params: SameTimeVisitCountParams): Promise<number> {
        const query: FindOptionsWhere<HospitalVisitEntity> = {
            department: {id: params.departmentId},
            dateTimeFrom: LessThan(new Date(params.to)),
            dateTimeTo: MoreThanOrEqual(new Date(params.from))
        };
        if (!params.vicariousMomVisitIncluded) {
            query.vicariousMomVisit = Equal(false);
        }

        return this.repository.countBy(query);
    }

    public async findAll(pageRequest: PageRequest): Promise<Pageable<HospitalVisitEntity>> {
        pageRequest.where = await this.filterFieldConverter.convert(pageRequest.where);
        return this.getPage(pageRequest, {});
    }

}
