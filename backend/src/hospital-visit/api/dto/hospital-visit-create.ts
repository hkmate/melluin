import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {
    IsArray,
    IsBoolean,
    IsDateString,
    IsEnum,
    IsIn,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Min
} from 'class-validator';
import {HospitalVisitCreate} from '@shared/hospital-visit/hospital-visit-create';
import {EventVisibility} from '@shared/hospital-visit/event-visibility';


export class HospitalVisitCreateValidatedInput  implements HospitalVisitCreate {

    @IsDateString()
    dateTimeFrom: string;

    @IsDateString()
    dateTimeTo: string;

    @IsNumber({maxDecimalPlaces: 2})
    @Min(0)
    @IsOptional()
    countedMinutes?: number;

    @IsEnum(EventVisibility)
    visibility: EventVisibility;

    @IsUUID()
    organizerId: string;

    @IsUUID('all', {each: true})
    @IsArray()
    participantIds: Array<string>;

    @IsEnum(HospitalVisitStatus)
    @IsIn([HospitalVisitStatus.DRAFT, HospitalVisitStatus.SCHEDULED])
    status: HospitalVisitStatus;

    @IsUUID()
    @IsString()
    departmentId: string;

    @IsBoolean()
    vicariousMomVisit: boolean;

}
