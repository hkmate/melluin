import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn} from 'typeorm';
import {ChildEntity} from '@be/child/model/child.entity';
import {UUID} from '@melluin/common';

@Entity({name: 'children_in_visit'})
export class VisitedChildEntity {

    @PrimaryColumn('uuid')
    id: UUID;

    @Column({name: 'visit_id', type: 'uuid'})
    visitId: UUID;

    @OneToOne(type => ChildEntity, {eager: true})
    @JoinColumn({name: 'child_id'})
    child: ChildEntity;

    @Column({name: 'is_parent_there'})
    isParentThere: boolean;

}
