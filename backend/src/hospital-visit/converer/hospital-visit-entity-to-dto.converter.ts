import {Injectable} from '@nestjs/common';
import {isNil} from '@shared/util/util';
import {Converter} from '@shared/converter/converter';
import {PersonEntityToIdentifierDtoConverter} from '@be/person/converer/person-entity-to-identifier-dto.converter';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {BaseEventEntityToDtoConverter} from '@be/event/converer/base-event-entity-to-dto.converter';
import {MelluinEvent} from '@shared/event/event';
import {DepartmentEntityToDtoConverter} from '@be/department/converer/department-entity-to-dto.converter';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';

@Injectable()
export class HospitalVisitEntityToDtoConverter extends BaseEventEntityToDtoConverter
    implements Converter<HospitalVisitEntity, HospitalVisit> {

    constructor(personConverter: PersonEntityToIdentifierDtoConverter,
                private readonly departmentConverter: DepartmentEntityToDtoConverter) {
        super(personConverter);
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
        const base: MelluinEvent = this.convertEventBase(entity);
        return {
            ...base,
            id: entity.id,
            department: this.departmentConverter.convert(entity.department),
            status: entity.status,
            participants: entity.participants.map(participant => this.personConverter.convert(participant))
        }
    }

}
