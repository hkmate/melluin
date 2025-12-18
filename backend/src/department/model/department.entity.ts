import {Column, Entity, PrimaryColumn} from 'typeorm';
import {OperationCity} from '@shared/person/operation-city';

@Entity({name: 'hospital_department'})
export class DepartmentEntity {

    @PrimaryColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({name: 'valid_from', type: 'timestamp'})
    validFrom: Date;

    @Column({name: 'valid_to', type: 'timestamp'})
    validTo: Date;

    @Column()
    address: string;

    @Column()
    city: OperationCity;

    @Column({name: 'diseases_info', type: 'text', nullable: true})
    diseasesInfo: string | null;

    @Column({type: 'text', nullable: true})
    note: string | null;

}
