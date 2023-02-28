import {Injectable} from '@nestjs/common';
import {isNil} from '@shared/util/util';
import {Converter} from '@shared/converter';
import {randomUUID} from 'crypto';
import {HospitalVisitCreate} from '@shared/hospital-visit/hospital-visit-create';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {DepartmentDao} from '@be/department/department.dao';
import {PersonDao} from '@be/person/person.dao';

@Injectable()
export class HospitalVisitCreationToEntityConverter
    implements Converter<HospitalVisitCreate, Promise<HospitalVisitEntity>> {

    constructor(private readonly departmentDao: DepartmentDao,
                private readonly personDao: PersonDao) {
    }

    public convert(value: HospitalVisitCreate): Promise<HospitalVisitEntity>;
    public convert(value: undefined): undefined;
    public convert(entity?: HospitalVisitCreate): Promise<HospitalVisitEntity> | undefined;
    public convert(entity?: HospitalVisitCreate): Promise<HospitalVisitEntity> | undefined {
        if (isNil(entity)) {
            return undefined;
        }
        return this.convertNotNilEntity(entity);
    }

    // eslint-disable-next-line max-lines-per-function
    private async convertNotNilEntity(dto: HospitalVisitCreate): Promise<HospitalVisitEntity> {
        const department = await this.departmentDao.getOne(dto.departmentId);
        const organizer = await this.personDao.getOne(dto.organizerId);
        const participants = await this.personDao.findByIds(dto.participantIds);
        return {
            id: randomUUID(),
            status: dto.status,
            department: department,
            organizer: organizer,
            visibility: dto.visibility,
            dateTimeFrom: new Date(dto.dateTimeFrom),
            dateTimeTo: new Date(dto.dateTimeTo),
            countedMinutes: dto.countedMinutes,
            participants,
        };
    }

}
