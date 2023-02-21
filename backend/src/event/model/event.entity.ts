import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryColumn} from 'typeorm';
import {PersonEntity} from '@be/person/model/person.entity';
import {EventVisibility} from '@shared/event/event-visibility';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {EventType} from '@shared/event/event-type';

@Entity({name: 'event'})
export class EventEntity {

    @PrimaryColumn('uuid')
    id: string;

    @Column({name: 'datetime_from', type: 'timestamp'})
    dateTimeFrom: Date;

    @Column({name: 'datetime_to', type: 'timestamp'})
    dateTimeTo: Date;

    @Column({name: 'counted_hours'})
    countedHours?: number;

    @Column()
    visibility: EventVisibility;

    @Column({name: 'event_type'})
    eventType: EventType;

    @OneToOne(type => PersonEntity, {eager: true})
    @JoinColumn({name: 'organizer_id'})
    organizer: PersonEntity;

    @OneToOne(type => HospitalVisitEntity,
        (visitEntity: HospitalVisitEntity) => visitEntity.event)
    hospitalVisit?: HospitalVisitEntity;

    @ManyToMany(
        type => PersonEntity,
        {eager: true, cascade: ['insert', 'update', 'remove']}
    )
    @JoinTable({
        name: 'event_participant',
        joinColumn: {
            name: 'event_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'person_id',
            referencedColumnName: 'id'
        }
    })
    participants: Array<PersonEntity>;

}
