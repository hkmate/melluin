import {Injectable} from '@nestjs/common';
import {Converter, VisitCreate, isNil} from '@melluin/common';
import {randomUUID} from 'crypto';
import {VisitEntity} from '@be/visit/model/visit.entity';
import {DepartmentDao} from '@be/department/department.dao';
import {PersonDao} from '@be/person/person.dao';

@Injectable()
export class VisitCreationToEntityConverter
    implements Converter<VisitCreate, Promise<VisitEntity>> {

    constructor(private readonly departmentDao: DepartmentDao,
                private readonly personDao: PersonDao) {
    }

    public convert(value: VisitCreate): Promise<VisitEntity>;
    public convert(value: undefined): undefined;
    public convert(entity?: VisitCreate): Promise<VisitEntity> | undefined;
    public convert(entity?: VisitCreate): Promise<VisitEntity> | undefined {
        if (isNil(entity)) {
            return undefined;
        }
        return this.convertNotNilEntity(entity);
    }

    // eslint-disable-next-line max-lines-per-function
    private async convertNotNilEntity(dto: VisitCreate): Promise<VisitEntity> {
        const department = await this.departmentDao.getOne(dto.departmentId);
        const organizer = await this.personDao.getOne(dto.organizerId);
        const participants = await this.personDao.findByIds(dto.participantIds);
        const id = randomUUID()
        return {
            id,
            status: dto.status,
            department: department,
            organizer: organizer,
            visibility: dto.visibility,
            dateTimeFrom: new Date(dto.dateTimeFrom),
            dateTimeTo: new Date(dto.dateTimeTo),
            countedMinutes: dto.countedMinutes,
            vicariousMomVisit: dto.vicariousMomVisit,
            connectionGroupId: id,
            participants,
        };
    }

}
