import {Column, Entity, PrimaryColumn} from 'typeorm';
import {UUID} from '@melluin/common';

@Entity({name: 'child_patient'})
export class ChildEntity {

    @PrimaryColumn('uuid')
    id: UUID;

    @Column()
    name: string;

    @Column({name: 'guessed_birth'})
    guessedBirth: string;

    @Column({type: 'text', nullable: true})
    info: string | null;

}
