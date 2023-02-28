import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn} from 'typeorm';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {ChildEntity} from '@be/child/model/child.entity';
import {VisitActivityType} from '@shared/hospital-visit-activity/visit-activity-type';

@Entity({name: 'hospital_visit_activity'})
export class HospitalVisitActivityEntity {

    @PrimaryColumn('uuid')
    id: string;

    @Column({name: 'activity_type'})
    type: VisitActivityType;

    @Column()
    comment: string;

    @Column({name: 'child_patient_id'})
    childId: string;

    @Column({name: 'group_id'})
    groupId: string;

    @Column({name: 'is_parent_there'})
    isParentThere: boolean;

    @OneToOne(type => HospitalVisitEntity)
    @JoinColumn({name: 'hospital_visit_id'})
    hospitalVisit: HospitalVisitEntity;

    @OneToOne(type => ChildEntity)
    @JoinColumn({name: 'child_patient_id'})
    child: ChildEntity;

}
