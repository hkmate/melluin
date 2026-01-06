import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {IsBoolean, IsEnum, IsIn, IsString, IsUUID} from 'class-validator';
import {EventCreate} from '@shared/event/event-create';


export class HospitalVisitCreate extends EventCreate {

    @IsEnum(HospitalVisitStatus)
    @IsIn([HospitalVisitStatus.DRAFT, HospitalVisitStatus.SCHEDULED])
    status: HospitalVisitStatus;

    @IsUUID()
    @IsString()
    departmentId: string;

    @IsBoolean()
    vicariousMomVisit: boolean;

}
