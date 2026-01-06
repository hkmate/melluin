import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryColumn} from 'typeorm';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {DepartmentEntity} from '@be/department/model/department.entity';
import {EventEntity} from '@be/event/model/event.entity';
import {PersonEntity} from '@be/person/model/person.entity';

@Entity({name: 'hospital_visit'})
export class HospitalVisitEntity extends EventEntity {

    @PrimaryColumn('uuid')
    id: string;

    @Column()
    status: HospitalVisitStatus;

    @Column({name: 'vicarious_mom_visit'})
    vicariousMomVisit: boolean;

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
