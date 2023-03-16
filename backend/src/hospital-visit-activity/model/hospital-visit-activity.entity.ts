import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn} from 'typeorm';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {VisitActivityType} from '@shared/hospital-visit-activity/visit-activity-type';
import {ActivityChildInfo} from '@shared/hospital-visit-activity/hospital-visit-activity-input';

@Entity({name: 'hospital_visit_activity'})
export class HospitalVisitActivityEntity {

    @PrimaryColumn('uuid')
    id: string;

    @Column({type: 'jsonb'})
    activities: Array<VisitActivityType>;

    @Column()
    comment: string;

    @Column({type: 'jsonb'})
    children: Array<ActivityChildInfo>;


    @OneToOne(type => HospitalVisitEntity)
    @JoinColumn({name: 'hospital_visit_id'})
    hospitalVisit: HospitalVisitEntity;

}
