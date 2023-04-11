import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from 'typeorm';
import {DepartmentEntity} from '@be/department/model/department.entity';
import {BoxStatusChangeReason} from '@shared/department/box/box-status-change-reason';

@Entity({name: 'hospital_box_status_report'})
export class DepartmentBoxStatusEntity {

    @PrimaryColumn('uuid')
    id: string;

    @Column({name: 'visit_id', type: 'uuid'})
    visitId?: string;

    @Column({name: 'date_time', type: 'timestamp'})
    dateTime: Date;

    @Column()
    reason: BoxStatusChangeReason;

    @Column({name: 'affected_object'})
    affectedObject?: string;

    @Column()
    comment?: string;

    @ManyToOne(type => DepartmentEntity)
    @JoinColumn({name: 'hospital_department_id'})
    department: DepartmentEntity;

}
