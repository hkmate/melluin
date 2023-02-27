import {EventVisibility} from '@shared/event/event-visibility';
import {PersonIdentifier} from '@shared/person/person';
import {EventType} from '@shared/event/event-type';

export interface MelluinEvent {

    event_id: string;
    dateTimeFrom: string;
    dateTimeTo: string;
    countedMinutes?: number;
    visibility: EventVisibility;
    organizer: PersonIdentifier;
    participants: Array<PersonIdentifier>;
    type: EventType;

}
