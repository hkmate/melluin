import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryColumn} from 'typeorm';
import {VisitEntity} from '@be/visit/model/visit.entity';
import {VisitActivityType} from '@melluin/common';
import {VisitedChildEntity} from '@be/visit-children/persistence/model/visited-child.entity';

@Entity({name: 'hospital_visit_activity'})
export class VisitActivityEntity {

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

    @OneToOne(type => VisitEntity)
    @JoinColumn({name: 'hospital_visit_id'})
    visit: VisitEntity;

}
