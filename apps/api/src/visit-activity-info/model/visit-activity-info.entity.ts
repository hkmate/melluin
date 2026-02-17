import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn} from 'typeorm';
import {VisitEntity} from '@be/visit/model/visit.entity';

@Entity({name: 'hospital_visit_activity_info'})
export class VisitActivityInfoEntity {

    @PrimaryColumn('uuid')
    id: string;

    @Column({type: 'text', nullable: true})
    content: string | null;

    @OneToOne(type => VisitEntity)
    @JoinColumn({name: 'hospital_visit_id'})
    visit: VisitEntity;

}
