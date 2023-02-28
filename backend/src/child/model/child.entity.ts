import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity({name: 'child_patient'})
export class ChildEntity {

    @PrimaryColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({name: 'birth_year'})
    birthYear: number;

    @Column()
    info: string;

}
