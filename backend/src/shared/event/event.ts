import {EventVisibility} from '@shared/event/event-visibility';
import {PersonIdentifier} from '@shared/person/person';

export interface MelluinEvent {

    dateTimeFrom: string;
    dateTimeTo: string;
    countedMinutes?: number;
    visibility: EventVisibility;
    organizer: PersonIdentifier;

}
