import {Injectable} from '@nestjs/common';
import {isNil} from '@shared/util/util';
import {Converter} from '@shared/converter';
import {EventEntity} from '@be/event/model/event.entity';
import {PersonEntityToIdentifierDtoConverter} from '@be/person/converer/person-entity-to-identifier-dto.converter';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {BaseEventEntityToDtoConverter} from '@be/event/converer/base-event-entity-to-dto.converter';
import {MelluinEvent} from '@shared/event/event';
import {DepartmentEntityToDtoConverter} from '@be/department/converer/department-entity-to-dto.converter';

@Injectable()
export class HospitalVisitEventEntityToDtoConverter extends BaseEventEntityToDtoConverter
    implements Converter<EventEntity, HospitalVisit> {

    constructor(personConverter: PersonEntityToIdentifierDtoConverter,
                private readonly departmentConverter: DepartmentEntityToDtoConverter) {
        super(personConverter);
    }

    public convert(value: EventEntity): HospitalVisit;
    public convert(value: undefined): undefined;
    public convert(entity?: EventEntity): HospitalVisit | undefined;
    public convert(entity?: EventEntity): HospitalVisit | undefined {
        if (isNil(entity)) {
            return undefined;
        }
        return this.convertNotNilEntity(entity);
    }

    private convertNotNilEntity(entity: EventEntity): HospitalVisit {
        const hospitalVisitEntity = entity.hospitalVisit!;
        const base: MelluinEvent = this.convertEventBase(entity);
        return {
            ...base,
            id: hospitalVisitEntity.id,
            department: this.departmentConverter.convert(hospitalVisitEntity.department),
            status: hospitalVisitEntity.status
        }
    }

}
