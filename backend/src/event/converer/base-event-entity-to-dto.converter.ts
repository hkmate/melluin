import {EventEntity} from '@be/event/model/event.entity';
import {MelluinEvent} from '@shared/event/event';
import {PersonEntityToIdentifierDtoConverter} from '@be/person/converer/person-entity-to-identifier-dto.converter';

export class BaseEventEntityToDtoConverter {

    constructor(protected readonly personConverter: PersonEntityToIdentifierDtoConverter) {
    }

    public convertEventBase(value: EventEntity): MelluinEvent {
        return {
            event_id: value.id,
            countedHours: value.countedHours,
            dateTimeFrom: value.dateTimeFrom.toISOString(),
            dateTimeTo: value.dateTimeTo.toISOString(),
            visibility: value.visibility,
            organizer: this.personConverter.convert(value.organizer),
            participants: value.participants.map(participant => this.personConverter.convert(participant))
        };
    }

}

