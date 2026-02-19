import {Injectable} from '@nestjs/common';
import {Converter, Visit, isNil} from '@melluin/common';
import {PersonEntityToIdentifierDtoConverter} from '@be/person/converer/person-entity-to-identifier-dto.converter';
import {DepartmentEntityToDtoConverter} from '@be/department/converer/department-entity-to-dto.converter';
import {VisitEntity} from '@be/visit/model/visit.entity';

@Injectable()
export class VisitEntityToDtoConverter implements Converter<VisitEntity, Visit> {

    constructor(private readonly personConverter: PersonEntityToIdentifierDtoConverter,
                private readonly departmentConverter: DepartmentEntityToDtoConverter) {
    }

    public convert(value: VisitEntity): Visit;
    public convert(value: undefined): undefined;
    public convert(entity?: VisitEntity): Visit | undefined;
    public convert(entity?: VisitEntity): Visit | undefined {
        if (isNil(entity)) {
            return undefined;
        }
        return this.convertNotNilEntity(entity);
    }

    private convertNotNilEntity(entity: VisitEntity): Visit {
        return {
            id: entity.id,
            countedMinutes: entity.countedMinutes,
            dateTimeFrom: entity.dateTimeFrom.toISOString(),
            dateTimeTo: entity.dateTimeTo.toISOString(),
            organizer: this.personConverter.convert(entity.organizer),
            department: this.departmentConverter.convert(entity.department),
            status: entity.status,
            participants: entity.participants.map(participant => this.personConverter.convert(participant)),
            vicariousMomVisit: entity.vicariousMomVisit,
            connectionGroupId: entity.connectionGroupId
        }
    }

}
