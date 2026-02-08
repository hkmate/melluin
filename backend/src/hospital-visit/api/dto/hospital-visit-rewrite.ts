import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {IsArray, IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min} from 'class-validator';
import {EventVisibility} from '@shared/hospital-visit/event-visibility';
import {HospitalVisitRewrite} from '@shared/hospital-visit/hospital-visit-rewrite';


export class HospitalVisitRewriteValidatedInput implements HospitalVisitRewrite {

    @IsUUID()
    id: string;

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

    @IsUUID('all', {each: true})
    @IsArray()
    participantIds: Array<string>;

    @IsEnum(HospitalVisitStatus)
    status: HospitalVisitStatus;

    @IsUUID()
    @IsString()
    departmentId: string;

    @IsBoolean()
    vicariousMomVisit: boolean;

}
