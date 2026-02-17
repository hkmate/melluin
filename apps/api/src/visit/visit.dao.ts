import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Equal, In, LessThan, MoreThan, Not, Repository} from 'typeorm';
import {
    FilterOperation,
    FilterOperationBuilder,
    getFailedStatuses,
    getFullName,
    isNil,
    isNotNil,
    Pageable,
    toOptional
} from '@melluin/common';
import {WhereClosureConverter} from '@be/find-option-converter/where-closure.converter';
import {PageCreator} from '@be/crud/page-creator';
import {PageRequest} from '@be/crud/page-request';
import {VisitEntity} from '@be/visit/model/visit.entity';
import {FilterOptionsFieldsConverter} from '@be/crud/convert/filter-options-fields-converter';
import {FindOptionsWhere} from 'typeorm/find-options/FindOptionsWhere';

interface SameTimeAndDepartmentVisitCountParams {
    from: string;
    to: string;
    departmentId: string;
    vicariousMomVisitIncluded: boolean;
}

interface SameTimeAndDParticipantsVisitCountParams {
    from: string;
    to: string;
    participantsIds: Array<string>;
    id?: string;
}

@Injectable()
export class VisitDao extends PageCreator<VisitEntity> {

    private readonly filterFieldConverter: FilterOptionsFieldsConverter;

    constructor(@InjectRepository(VisitEntity) repository: Repository<VisitEntity>,
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

    public save(visit: VisitEntity): Promise<VisitEntity> {
        return this.repository.save(visit);
    }

    public saveMany(...visits: Array<VisitEntity>): Promise<void> {
        return this.repository.save(visits).then();
    }

    public findOne(id: string): Promise<VisitEntity | undefined> {
        return this.repository.findOne({
            where: {id},
        }).then(toOptional);
    }

    public async getOne(id: string): Promise<VisitEntity> {
        const entity = await this.findOne(id);
        if (isNil(entity)) {
            throw new NotFoundException(`Event not found with id: ${id}`);
        }
        return entity;
    }

    public countForSameTimeAndDepartment(params: SameTimeAndDepartmentVisitCountParams): Promise<number> {
        const query: FindOptionsWhere<VisitEntity> = {
            department: {id: params.departmentId},
            dateTimeFrom: LessThan(new Date(params.to)),
            dateTimeTo: MoreThan(new Date(params.from)),
            status: Not(In(getFailedStatuses()))
        };
        if (!params.vicariousMomVisitIncluded) {
            query.vicariousMomVisit = Equal(false);
        }

        return this.repository.countBy(query);
    }

    public countForSameTimeAndParticipants(params: SameTimeAndDParticipantsVisitCountParams): Promise<number> {
        const query: FindOptionsWhere<VisitEntity> = {
            participants: {id: In(params.participantsIds)},
            dateTimeFrom: LessThan(new Date(params.to)),
            dateTimeTo: MoreThan(new Date(params.from)),
            status: Not(In(getFailedStatuses()))
        };
        if (isNotNil(params.id)) {
            query.id = Not(Equal(params.id));
        }

        return this.repository.countBy(query);
    }

    public async findAll(pageRequest: PageRequest): Promise<Pageable<VisitEntity>> {
        pageRequest.where = await this.filterFieldConverter.convert(pageRequest.where);
        const page = await this.getPage(pageRequest, {});
        page.items = this.sortParticipants(page.items);
        return page;
    }

    private sortParticipants(items: Array<VisitEntity>): Array<VisitEntity> {
        items.forEach(visit => visit.participants.sort(
            (p1, p2) => getFullName(p1).localeCompare(getFullName(p2))));
        return items;
    }

}
