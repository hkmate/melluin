import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {IsEnum, IsString, IsUUID} from 'class-validator';
import {EventRewrite} from '@shared/event/event-rewrite';


export class HospitalVisitRewrite extends EventRewrite {

    @IsUUID()
    id: string;

    @IsEnum(HospitalVisitStatus)
    status: HospitalVisitStatus;

    @IsUUID()
    @IsString()
    departmentId: string;

}
