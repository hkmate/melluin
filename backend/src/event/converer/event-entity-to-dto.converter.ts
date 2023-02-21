import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {isNil} from '@shared/util/util';
import {Converter} from '@shared/converter';
import {EventEntity} from '@be/event/model/event.entity';
import {MelluinEvent} from '@shared/event/event';
import {PersonEntityToIdentifierDtoConverter} from '@be/person/converer/person-entity-to-identifier-dto.converter';
import {EventType} from '@shared/event/event-type';
import {HospitalVisitEventEntityToDtoConverter} from '@be/event/converer/hospital-visit-event-entity-to-dto.converter';

@Injectable()
export class EventEntityToDtoConverter implements Converter<EventEntity, MelluinEvent> {

    constructor(private readonly personConverter: PersonEntityToIdentifierDtoConverter,
                private readonly hospitalVisitConverter: HospitalVisitEventEntityToDtoConverter) {
    }

    public convert(value: EventEntity): MelluinEvent;
    public convert(value: undefined): undefined;
    public convert(entity?: EventEntity): MelluinEvent | undefined;
    public convert(entity?: EventEntity): MelluinEvent | undefined {
        if (isNil(entity)) {
            return undefined;
        }
        return this.convertNotNilEntity(entity);
    }

    private convertNotNilEntity(entity: EventEntity): MelluinEvent {
        return this.getConverterByType(entity.eventType)
            .convert(entity);
    }

    private getConverterByType(type: EventType): Converter<EventEntity, MelluinEvent> {
        if (type !== EventType.HOSPITAL_VISIT) {
            throw new InternalServerErrorException('Found an event with an unexpected type!');
        }
        return this.hospitalVisitConverter;
    }

}
