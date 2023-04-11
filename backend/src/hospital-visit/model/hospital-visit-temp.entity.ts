import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity({name: 'hospital_visit_tmp'})
export class HospitalVisitTempEntity {

    @PrimaryColumn('uuid')
    id: string;

    @Column({name: 'visit_id', type: 'uuid'})
    visitId: string;

    @Column()
    key: string;

    @Column({type: 'jsonb'})
    value?: unknown;

}
