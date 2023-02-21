import {Injectable} from '@nestjs/common';
import {Pageable} from '@shared/api-util/pageable';
import {PageConverter} from '@be/crud/convert/page.converter';
import {User} from '@shared/user/user';
import {PageRequest} from '@be/crud/page-request';
import {EventDao} from '@be/event/event.dao';
import {MelluinEvent} from '@shared/event/event';
import {EventEntity} from '@be/event/model/event.entity';
import {EventEntityToDtoConverter} from '@be/event/converer/event-entity-to-dto.converter';
import {PageRequestFieldsValidator} from '@be/crud/validator/page-request-fields.validator';
import {eventFilterableFields, eventSortableFields} from '@shared/event/event-filterable-fields';

@Injectable()
export class EventCrudService {

    constructor(private readonly eventDao: EventDao,
                private readonly eventConverter: EventEntityToDtoConverter) {
    }

    public async find(pageRequest: PageRequest, requester: User): Promise<Pageable<MelluinEvent>> {
        PageRequestFieldsValidator
            .of(eventSortableFields, eventFilterableFields)
            .validate(pageRequest);
        // TODO add validation via user permissions

        const pageOfEntities: Pageable<EventEntity> = await this.eventDao.findAll(pageRequest);
        const pageConverter = PageConverter.of(this.eventConverter);
        return pageConverter.convert(pageOfEntities);
    }

}
