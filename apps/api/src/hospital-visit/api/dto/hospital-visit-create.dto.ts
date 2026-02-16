import {EventVisibility, HospitalVisitCreate, HospitalVisitStatus} from '@melluin/common';
import {ApiProperty} from '@nestjs/swagger';
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


export class HospitalVisitCreateDto implements HospitalVisitCreate {

    @ApiProperty()
    @IsDateString()
    dateTimeFrom: string;

    @ApiProperty()
    @IsDateString()
    dateTimeTo: string;

    @ApiProperty({required: false})
    @IsNumber({maxDecimalPlaces: 2})
    @Min(0)
    @IsOptional()
    countedMinutes?: number;

    @ApiProperty()
    @IsEnum(EventVisibility)
    visibility: EventVisibility;

    @ApiProperty()
    @IsUUID()
    organizerId: string;

    @ApiProperty()
    @IsUUID('all', {each: true})
    @IsArray()
    participantIds: Array<string>;

    @ApiProperty({enum: [HospitalVisitStatus.DRAFT, HospitalVisitStatus.SCHEDULED]})
    @IsEnum(HospitalVisitStatus)
    @IsIn([HospitalVisitStatus.DRAFT, HospitalVisitStatus.SCHEDULED])
    status: HospitalVisitStatus;

    @ApiProperty()
    @IsUUID()
    @IsString()
    departmentId: string;

    @ApiProperty()
    @IsBoolean()
    vicariousMomVisit: boolean;

}
