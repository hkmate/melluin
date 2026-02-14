import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn} from 'typeorm';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';

@Entity({name: 'hospital_visit_activity_info'})
export class HospitalVisitActivityInfoEntity {

    @PrimaryColumn('uuid')
    id: string;

    @Column({type: 'text', nullable: true})
    content: string | null;

    @OneToOne(type => HospitalVisitEntity)
    @JoinColumn({name: 'hospital_visit_id'})
    hospitalVisit: HospitalVisitEntity;

}
