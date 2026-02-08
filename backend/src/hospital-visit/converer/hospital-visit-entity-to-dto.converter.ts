import {Injectable} from '@nestjs/common';
import {isNil} from '@shared/util/util';
import {Converter} from '@shared/converter/converter';
import {PersonEntityToIdentifierDtoConverter} from '@be/person/converer/person-entity-to-identifier-dto.converter';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {DepartmentEntityToDtoConverter} from '@be/department/converer/department-entity-to-dto.converter';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';

@Injectable()
export class HospitalVisitEntityToDtoConverter implements Converter<HospitalVisitEntity, HospitalVisit> {

    constructor(private readonly personConverter: PersonEntityToIdentifierDtoConverter,
                private readonly departmentConverter: DepartmentEntityToDtoConverter) {
    }

    public convert(value: HospitalVisitEntity): HospitalVisit;
    public convert(value: undefined): undefined;
    public convert(entity?: HospitalVisitEntity): HospitalVisit | undefined;
    public convert(entity?: HospitalVisitEntity): HospitalVisit | undefined {
        if (isNil(entity)) {
            return undefined;
        }
        return this.convertNotNilEntity(entity);
    }

    private convertNotNilEntity(entity: HospitalVisitEntity): HospitalVisit {
        return {
            id: entity.id,
            countedMinutes: entity.countedMinutes,
            dateTimeFrom: entity.dateTimeFrom.toISOString(),
            dateTimeTo: entity.dateTimeTo.toISOString(),
            visibility: entity.visibility,
            organizer: this.personConverter.convert(entity.organizer),
            department: this.departmentConverter.convert(entity.department),
            status: entity.status,
            participants: entity.participants.map(participant => this.personConverter.convert(participant)),
            vicariousMomVisit: entity.vicariousMomVisit,
            connectionGroupId: entity.connectionGroupId
        }
    }

}
