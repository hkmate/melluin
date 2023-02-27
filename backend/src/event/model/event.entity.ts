import {Column, JoinColumn, OneToOne} from 'typeorm';
import {PersonEntity} from '@be/person/model/person.entity';
import {EventVisibility} from '@shared/event/event-visibility';

export class EventEntity {

    @Column({name: 'datetime_from', type: 'timestamp'})
    dateTimeFrom: Date;

    @Column({name: 'datetime_to', type: 'timestamp'})
    dateTimeTo: Date;

    @Column({name: 'counted_minutes'})
    countedMinutes?: number;

    @Column()
    visibility: EventVisibility;

    @OneToOne(type => PersonEntity, {eager: true})
    @JoinColumn({name: 'organizer_id'})
    organizer: PersonEntity;

}
