import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from 'typeorm';
import {DepartmentEntity} from '@be/department/model/department.entity';
import {BoxStatusChangeReason, UUID} from '@melluin/common';

@Entity({name: 'hospital_box_status_report'})
export class DepartmentBoxStatusEntity {

    @PrimaryColumn('uuid')
    id: UUID;

    @Column({name: 'visit_id', type: 'uuid', nullable: true})
    visitId: UUID | null;

    @Column({name: 'date_time', type: 'timestamp'})
    dateTime: Date;

    @Column()
    reason: BoxStatusChangeReason;

    @Column({name: 'affected_object', type: 'text', nullable: true})
    affectedObject: string | null;

    @Column({type: 'text', nullable: true})
    comment: string | null;

    @ManyToOne(type => DepartmentEntity)
    @JoinColumn({name: 'hospital_department_id'})
    department: DepartmentEntity;

}
