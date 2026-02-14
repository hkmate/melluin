import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryColumn} from 'typeorm';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {DepartmentEntity} from '@be/department/model/department.entity';
import {PersonEntity} from '@be/person/model/person.entity';
import {EventVisibility} from '@shared/hospital-visit/event-visibility';

@Entity({name: 'hospital_visit'})
export class HospitalVisitEntity {

    @PrimaryColumn('uuid')
    id: string;

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

    @Column()
    status: HospitalVisitStatus;

    @Column({name: 'vicarious_mom_visit'})
    vicariousMomVisit: boolean;

    @Column({name: 'group_id', type: 'uuid'})
    connectionGroupId: string;

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
