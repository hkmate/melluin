import {EventVisibility} from '@shared/event/event-visibility';
import {PersonIdentifier} from '@shared/person/person';

export interface MelluinEvent {

    event_id: string;
    dateTimeFrom: string;
    dateTimeTo: string;
    countedHours?: number;
    visibility: EventVisibility;
    organizer: PersonIdentifier;
    participants: Array<PersonIdentifier>;

}
