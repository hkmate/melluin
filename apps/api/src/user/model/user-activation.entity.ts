import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from 'typeorm';
import {UserActivation} from '@be/user/model/user-activation';
import {UserEntity} from '@be/user/model/user.entity';

@Entity({name: 'user_activation'})
export class UserActivationEntity {

    @PrimaryColumn('uuid')
    id: string;

    @Column({name: 'created_at', type: 'timestamp', nullable: true})
    createdAt: Date | null;

    @Column()
    action: UserActivation;

    @ManyToOne(() => UserEntity)
    @JoinColumn({name: 'user_id'})
    user: UserEntity;

}
