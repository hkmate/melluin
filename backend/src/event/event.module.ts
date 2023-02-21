import {Module} from '@nestjs/common';
import {EventEntityToDtoConverter} from '@be/event/converer/event-entity-to-dto.converter';
import {EventCrudService} from '@be/event/event.crud.service';
import {EventController} from '@be/event/event.controller';
import {EventPersistenceModule} from '@be/event/event.persistence.module';
import {PersonModule} from '@be/person/person.module';
import {DepartmentModule} from '@be/department/department.module';
import {HospitalVisitEventEntityToDtoConverter} from '@be/event/converer/hospital-visit-event-entity-to-dto.converter';

@Module({
    imports: [
        EventPersistenceModule,
        PersonModule,
        DepartmentModule,
    ],
    providers: [
        EventEntityToDtoConverter,
        HospitalVisitEventEntityToDtoConverter,
        EventCrudService,
        EventController
    ],
    controllers: [EventController]
})
export class EventModule {
}
