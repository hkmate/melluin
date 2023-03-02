import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {IsEnum, IsString, IsUUID} from 'class-validator';
import {EventRewrite} from '@shared/event/event-rewrite';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';


export class HospitalVisitRewrite extends EventRewrite {

    @IsUUID()
    id: string;

    @IsEnum(HospitalVisitStatus)
    status: HospitalVisitStatus;

    @IsUUID()
    @IsString()
    departmentId: string;


    public static from(visit: HospitalVisit): HospitalVisitRewrite {
        return {
            id: visit.id,
            departmentId: visit.department.id,
            visibility: visit.visibility,
            dateTimeFrom: visit.dateTimeFrom,
            dateTimeTo: visit.dateTimeTo,
            countedMinutes: visit.countedMinutes,
            participantIds: visit.participants.map(p => p.id),
            status: visit.status,
        };
    }

}
