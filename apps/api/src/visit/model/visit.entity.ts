import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryColumn} from 'typeorm';
import {DepartmentEntity} from '@be/department/model/department.entity';
import {PersonEntity} from '@be/person/model/person.entity';
import {UUID, VisitStatus} from '@melluin/common';

@Entity({name: 'hospital_visit'})
export class VisitEntity {

    @PrimaryColumn('uuid')
    id: UUID;

    @Column({name: 'datetime_from', type: 'timestamp'})
    dateTimeFrom: Date;

    @Column({name: 'datetime_to', type: 'timestamp'})
    dateTimeTo: Date;

    @Column({name: 'counted_minutes'})
    countedMinutes?: number;

    @OneToOne(type => PersonEntity, {eager: true})
    @JoinColumn({name: 'organizer_id'})
    organizer: PersonEntity;

    @Column()
    status: VisitStatus;

    @Column({name: 'vicarious_mom_visit'})
    vicariousMomVisit: boolean;

    @Column({name: 'group_id', type: 'uuid'})
    connectionGroupId: UUID;

    @OneToOne(type => DepartmentEntity, {eager: true})
    @JoinColumn({name: 'department_id'})
    department: DepartmentEntity;

    @ManyToMany(type => PersonEntity, {eager: true})
    @JoinTable({
        name: 'hospital_visit_participant',
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
