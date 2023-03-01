import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity({name: 'child_patient'})
export class ChildEntity {

    @PrimaryColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({name: 'guessed_birth'})
    guessedBirth: string;

    @Column()
    info: string;

}
