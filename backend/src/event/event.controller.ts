import {Controller, Get} from '@nestjs/common';
import {Pageable} from '@shared/api-util/pageable';
import {User} from '@shared/user/user';
import {CurrentUser} from '@be/auth/decorator/current-user.decorator';
import {PageReq} from '@be/crud/page-req';
import {PageRequest} from '@be/crud/page-request';
import {EventCrudService} from '@be/event/event.crud.service';
import {MelluinEvent} from '@shared/event/event';


@Controller('events')
export class EventController {

    constructor(private readonly eventCrudService: EventCrudService) {
    }

    @Get()
    public find(@PageReq() pageRequest: PageRequest,
                @CurrentUser() requester: User): Promise<Pageable<MelluinEvent>> {
        return this.eventCrudService.find(pageRequest, requester);
    }

}
