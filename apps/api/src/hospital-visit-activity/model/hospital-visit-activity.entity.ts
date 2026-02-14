import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryColumn} from 'typeorm';
import {HospitalVisitEntity} from '@be/hospital-visit/model/hospital-visit.entity';
import {VisitActivityType} from '@shared/hospital-visit-activity/visit-activity-type';
import {VisitedChildEntity} from '@be/hospital-visit-children/persistence/model/visited-child.entity';

@Entity({name: 'hospital_visit_activity'})
export class HospitalVisitActivityEntity {

    @PrimaryColumn('uuid')
    id: string;

    @Column({type: 'jsonb'})
    activities: Array<VisitActivityType>;

    @Column()
    comment: string;

    @ManyToMany(type => VisitedChildEntity, {eager: true})
    @JoinTable({
        name: 'children_in_visit_at_activity',
        joinColumn: {
            name: 'activity_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'visited_child_id',
            referencedColumnName: 'id'
        }
    })
    children: Array<VisitedChildEntity>;

    @OneToOne(type => HospitalVisitEntity)
    @JoinColumn({name: 'hospital_visit_id'})
    hospitalVisit: HospitalVisitEntity;

}
