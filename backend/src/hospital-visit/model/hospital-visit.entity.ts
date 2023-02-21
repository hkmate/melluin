import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn} from 'typeorm';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {DepartmentEntity} from '@be/department/model/department.entity';
import {EventEntity} from '@be/event/model/event.entity';

@Entity({name: 'hospital_visit'})
export class HospitalVisitEntity {

    @PrimaryColumn('uuid')
    id: string;

    @Column()
    status: HospitalVisitStatus;

    @OneToOne(type => DepartmentEntity, {eager: true})
    @JoinColumn({name: 'department_id'})
    department: DepartmentEntity;

    @OneToOne(type => EventEntity, {cascade: ['insert', 'update', 'remove']})
    @JoinColumn({name: 'event_id'})
    event: EventEntity;

}
