import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {IsEnum, IsString, IsUUID} from 'class-validator';
import {EventCreate} from '@shared/event/event-create';


export class HospitalVisitCreate extends EventCreate {

    @IsEnum(HospitalVisitStatus)
    status: HospitalVisitStatus;

    @IsUUID()
    @IsString()
    departmentId: string;

}
